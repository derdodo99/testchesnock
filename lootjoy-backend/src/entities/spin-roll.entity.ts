import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ tableName: 'spin_rolls' })
export class SpinRoll {
  @PrimaryKey() id!: number;
  @ManyToOne(() => UserEntity) user!: UserEntity;
  @Property() price!: number;
  @Property({ type: 'jsonb' }) result!: any; // выбранный исход
  @Property() deltaCrystals!: number; // +выдача -списание (обычно = payout - price)
  @Property({ nullable: true }) correlationId?: string;
  @Property() createdAt: Date = new Date();
}
