import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '@src/entities/user.entity';
import { WalletEntity } from '@src/entities/wallet.entity';

@Injectable()
export class WalletsRepository {
  constructor(private readonly em: EntityManager) {}

  async findByUser(user: UserEntity): Promise<WalletEntity | null> {
    return this.em.findOne(WalletEntity, { user });
  }

  create(user: UserEntity): WalletEntity {
    return this.em.create(WalletEntity, { user, balanceCrystals: 0 });
  }

  persist(wallet: WalletEntity): void {
    this.em.persist(wallet);
  }
}
