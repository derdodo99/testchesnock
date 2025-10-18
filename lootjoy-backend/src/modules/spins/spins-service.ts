import { Injectable, BadRequestException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/core';
import { SpinsRepository } from './spins.repository';
import { PrizeType } from '@root/common/enums';
import { UserEntity } from '@src/entities/user.entity';

@Injectable()
export class SpinsService {
  constructor(private readonly repo: SpinsRepository) {}

  @Transactional()
  async spin(user: UserEntity, poolId: string, demo = false) {
    const pool = await this.repo.findActivePool(poolId);
    const wallet = await this.repo.findWallet(user);
    if (!wallet) throw new BadRequestException('NO_WALLET');
    if (!demo && wallet.balanceCrystals < pool.cost)
      throw new BadRequestException('INSUFFICIENT_FUNDS');

    const available = pool.items
      .getItems()
      .filter((i) => i.isActive && (i.stock == null || i.stock > 0));

    const rnd = Math.random();
    const total = available.reduce((s, i) => s + i.weight, 0);
    let acc = 0;
    const item =
      available.find((i) => (acc += i.weight) >= rnd * total) ?? available[available.length - 1];

    if (!demo) wallet.balanceCrystals -= pool.cost;

    if (item.type === PrizeType.CRYSTALS) {
      const crystals = item.crystals ?? 0;
      if (!demo) wallet.balanceCrystals += crystals;
      this.repo.createRoll({
        pool,
        user,
        resultType: PrizeType.CRYSTALS,
        resultCrystals: crystals,
        cost: pool.cost,
        demo,
        serverSeedHash: 'placeholder',
        clientSeed: 'client',
        nonce: Date.now(),
        createdAt: new Date(),
      });
      await this.repo.flush();
      return { resultType: PrizeType.CRYSTALS, crystals, balance: wallet.balanceCrystals };
    }

    // ITEM
    const itemId = item.itemId!;
    if (!demo) {
      if (item.stock != null) item.stock--;
      this.repo.createInventory(user, itemId);
    }

    this.repo.createRoll({
      pool,
      user,
      resultType: PrizeType.ITEM,
      resultItemId: itemId,
      cost: pool.cost,
      demo,
      serverSeedHash: 'placeholder',
      clientSeed: 'client',
      nonce: Date.now(),
      createdAt: new Date(),
    });

    await this.repo.flush();
    return { resultType: PrizeType.ITEM, itemId, balance: wallet.balanceCrystals };
  }
}
