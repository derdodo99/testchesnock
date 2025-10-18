import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/core';
import { SpinsRepository } from './spins.repository';
import { PrizeType } from '@root/common/enums';
import { UserEntity } from '@src/entities/user.entity';
import { createHash, createHmac } from 'node:crypto';

@Injectable()
export class SpinsService {
  constructor(private readonly repo: SpinsRepository) {}

  async listPools() {
    return this.repo.listActivePools();
  }

  @Transactional()
  async spin(user: UserEntity, poolId: string, demo = false, clientSeed?: string) {
    const pool = await this.repo.findActivePool(poolId);

    // 1) Лочим кошелёк пользователя (пессимистический лок) и проверяем средства
    const wallet = await this.repo.findWalletForUpdate(user);
    if (!wallet) throw new BadRequestException('NO_WALLET');
    if (!demo && wallet.balanceCrystals < pool.cost) {
      throw new BadRequestException('INSUFFICIENT_FUNDS');
    }

    // 2) Фильтруем доступные призы
    const available = pool.items
      .getItems()
      .filter((i) => i.isActive && (i.stock == null || i.stock > 0));
    if (available.length === 0) {
      throw new ServiceUnavailableException('POOL_EMPTY');
    }

    // 3) fair seeds + идемпотентность
    const serverSeed = process.env.SPIN_SERVER_SEED ?? 'dev-server-seed'; // зафиксируй в env
    const serverSeedHash = createHash('sha256').update(serverSeed).digest('hex');

    const nonce = await this.repo.nextUserNonce(user); // счётчик спинов (не demo)
    const cs = clientSeed ?? `${user.id}:${nonce}`; // можно передавать с фронта

    // если тот же запрос уже был — отдаем тот же результат
    const existing = await this.repo.findRollByUserSeedNonce(user, cs, nonce);
    if (existing) {
      return this.repo.toSpinResponse(existing, wallet.balanceCrystals);
    }

    // 4) Provably fair RNG -> 0..1
    const h = createHmac('sha256', serverSeed).update(`${cs}:${nonce}`).digest('hex'); // 64 hex
    const hi = parseInt(h.slice(0, 16), 16); // 8 байт
    const r01 = hi / 0xffff_ffff_ffff_ffff;

    // 5) Выбор по весам
    const total = available.reduce((s, i) => s + i.weight, 0);
    let r = r01 * total;
    let chosen = available[available.length - 1];
    for (const it of available) {
      r -= it.weight;
      if (r <= 0) {
        chosen = it;
        break;
      }
    }

    // 6) Списание стоимости
    if (!demo) wallet.balanceCrystals -= pool.cost;

    // 7) Применяем результат
    if (chosen.type === PrizeType.CRYSTALS) {
      const crystals = chosen.crystals ?? 0;
      if (!demo) wallet.balanceCrystals += crystals;

      this.repo.createRoll({
        pool,
        user,
        resultType: PrizeType.CRYSTALS,
        resultCrystals: crystals,
        cost: pool.cost,
        demo,
        serverSeedHash,
        clientSeed: cs,
        nonce,
        createdAt: new Date(),
      });

      await this.repo.flush();
      return { resultType: PrizeType.CRYSTALS, crystals, balance: wallet.balanceCrystals };
    }

    // ITEM
    const itemId = chosen.itemId!;
    if (!demo) {
      // атомно уменьшаем stock: ... set stock = stock - 1 where id=? and stock > 0
      const ok = await this.repo.decrementItemStock(chosen.id);
      if (!ok) throw new ServiceUnavailableException('OUT_OF_STOCK');
      this.repo.createInventory(user, itemId);
    }

    this.repo.createRoll({
      pool,
      user,
      resultType: PrizeType.ITEM,
      resultItemId: itemId,
      cost: pool.cost,
      demo,
      serverSeedHash,
      clientSeed: cs,
      nonce,
      createdAt: new Date(),
    });

    await this.repo.flush();
    return { resultType: PrizeType.ITEM, itemId, balance: wallet.balanceCrystals };
  }
}
