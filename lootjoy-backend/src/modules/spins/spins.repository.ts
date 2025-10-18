import { Injectable } from '@nestjs/common';
import { EntityManager, LockMode, SqlEntityManager } from '@mikro-orm/postgresql';
import { WalletEntity } from '@src/entities/wallet.entity';
import { InventoryItemEntity } from '@src/entities/inventory-item.entity';
import { SpinRollEntity } from '@src/entities/spin-roll.entity';
import { UserEntity } from '@src/entities/user.entity';
import { CreateSpinRollDto } from '@src/modules/spins/dto/create-spin-roll.dto';
import { SpinPoolEntity } from '@src/entities/spin-pool.entity';

@Injectable()
export class SpinsRepository {
  constructor(private readonly em: EntityManager) {}
  findActivePool(poolId: string) {
    return this.em.findOneOrFail(
      SpinPoolEntity,
      { id: poolId, isActive: true },
      { populate: ['items'] },
    );
  }

  async findWalletForUpdate(user: UserEntity) {
    return this.em.findOne(WalletEntity, { user }, { lockMode: LockMode.PESSIMISTIC_WRITE });
  }

  async nextUserNonce(user: UserEntity) {
    return this.em.count(SpinRollEntity, { user, demo: false }).then((c) => c + 1);
  }

  findRollByUserSeedNonce(user: UserEntity, clientSeed: string, nonce: number) {
    return this.em.findOne(SpinRollEntity, { user, clientSeed, nonce });
  }

  // атомное уменьшение stock
  async decrementItemStock(itemId: string) {
    const knex = (this.em as unknown as SqlEntityManager).getKnex();
    const res = await knex('spin_item')
      .where('id', itemId)
      .andWhere('stock', '>', 0) // условие
      .update({ stock: knex.raw('stock - 1') }); // атомный декремент

    return res > 0; // true — если реально уменьшили
  }

  createInventory(user: UserEntity, itemId: string) {
    const inv = this.em.create(InventoryItemEntity, { user, itemId, createdAt: new Date() });
    this.em.persist(inv);
  }

  createRoll(data: CreateSpinRollDto) {
    const roll = this.em.create(SpinRollEntity, data);
    this.em.persist(roll);
    return roll;
  }

  flush() {
    return this.em.flush();
  }

  async listActivePools() {
    return this.em.find(SpinPoolEntity, { isActive: true }, { populate: ['items'] });
  }
  toSpinResponse(roll: SpinRollEntity, balance: number) {
    if (roll.resultType === ('CRYSTALS' as any)) {
      return { resultType: roll.resultType, crystals: roll.resultCrystals ?? 0, balance };
    }
    return { resultType: roll.resultType, itemId: roll.resultItemId!, balance };
  }
}
