import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { SpinPoolEntity } from '@src/entities/spin-pool.entity';
import { WalletEntity } from '@src/entities/wallet.entity';
import { InventoryItemEntity } from '@src/entities/inventory-item.entity';
import { SpinRollEntity } from '@src/entities/spin-roll.entity';
import { CreateSpinRollDto } from '@src/modules/spins/dto/create-spin-roll.dto';
import { UserEntity } from '@src/entities/user.entity';

@Injectable()
export class SpinsRepository extends EntityRepository<SpinPoolEntity> {
  findActivePool(poolId: string) {
    return this.findOneOrFail({ id: poolId, isActive: true }, { populate: ['items'] });
  }

  findWallet(user: UserEntity) {
    return this.em.findOne(WalletEntity, { user });
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

  async flush() {
    await this.em.flush();
  }

  async transactional<T>(cb: (em: EntityManager) => Promise<T>) {
    return this.em.transactional(cb);
  }
}
