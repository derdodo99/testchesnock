import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { RpsGame } from './rps-game.entity';
import { User } from './user.entity';
import type { RpsSymbol } from '../../common/types';

@Entity({ tableName: 'rps_moves' })
export class RpsMove {
  @PrimaryKey()
  id!: string; // uuid

  @ManyToOne(() => RpsGame)
  game!: RpsGame;

  @ManyToOne(() => User)
  user!: User;

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
