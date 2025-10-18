import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { SpinPoolEntity } from '@src/entities/spin-pool.entity';
import { PrizeType } from '@root/common/enums';

@Entity({ tableName: 'spin_item' })
export class SpinItemEntity {
  @PrimaryKey() id: string = crypto.randomUUID();
  @ManyToOne(() => SpinPoolEntity) pool!: SpinPoolEntity;
  @Enum(() => PrizeType) type!: PrizeType;
  @Property({ nullable: true }) crystals?: number;
  @Property({ nullable: true }) itemId?: string;
  @Property() weight!: number; // вероятность
  @Property({ nullable: true }) stock?: number;
  @Property({ default: true }) isActive!: boolean;
}
