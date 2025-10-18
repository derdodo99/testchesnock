import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ tableName: 'inventory_item' })
export class InventoryItemEntity {
  @PrimaryKey() id: string = crypto.randomUUID();
  @ManyToOne(() => UserEntity) user!: UserEntity;
  @Property() itemId!: string;
  @Property() createdAt = new Date();
}
