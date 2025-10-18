import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ tableName: 'wallets' })
export class WalletEntity {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @OneToOne(() => UserEntity, { unique: true })
  user!: UserEntity;

  @Property({ default: 0 })
  balanceCrystals!: number;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
