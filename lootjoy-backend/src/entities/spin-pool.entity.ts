import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'spin_pools' })
export class SpinPool {
  @PrimaryKey() id!: number;
  @Property() price!: number;
  @Property({ type: '  jsonb' }) config!: Array<{
    label: string;
    type: 'crystals' | 'item';
    value?: number; // для crystals
    itemId?: string; // для item
    chance: number; // проценты
  }>;
  @Property() createdAt: Date = new Date();
}
