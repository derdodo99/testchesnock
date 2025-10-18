import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { SpinItemEntity } from '@src/entities/spin-item.entity';

@Entity({ tableName: 'spin_pools' })
export class SpinPoolEntity {
  @PrimaryKey() id: string = crypto.randomUUID();
  @Property() name!: string; // "25 Crystals Pool"
  @Property() cost!: number; // цена спина
  @Property({ default: true }) isActive!: boolean;
  @OneToMany(() => SpinItemEntity, (i) => i.pool)
  items = new Collection<SpinItemEntity>(this);
  @Property() createdAt = new Date();
}
