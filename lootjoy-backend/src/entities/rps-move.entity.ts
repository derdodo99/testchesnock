import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { RpsGameEntity } from '@src/entities/rps-game.entity';
import { UserEntity } from '@src/entities/user.entity';
import type { RpsSymbol } from '@root/common/types';

@Entity({ tableName: 'rps_moves' })
export class RpsMoveEntity {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @ManyToOne(() => RpsGameEntity)
  game!: RpsGameEntity;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Property()
  commitHash!: string;

  @Property({ nullable: true })
  symbol?: RpsSymbol;

  @Property({ nullable: true })
  nonce?: string;

  @Property()
  committedAt: Date = new Date();

  @Property({ nullable: true })
  revealedAt?: Date;
}
