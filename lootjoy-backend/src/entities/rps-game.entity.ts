import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { RpsGameStatus } from '../../common/enums';
import { RpsMove } from './rps-move.entity'; // у тебя уже есть

@Entity({ tableName: 'rps_games' })
export class RpsGame {
  @PrimaryKey()
  id!: string; // uuid

  @Property()
  bet!: number; // в кристаллах

  @Property({ type: 'string', default: RpsGameStatus.WAITING })
  status: RpsGameStatus = RpsGameStatus.WAITING;

  @ManyToOne(() => User)
  creator!: User;

  @ManyToOne(() => User, { nullable: true })
  opponent: User | null = null;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  startedAt?: Date;

  @Property({ nullable: true })
  finishedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  winner: User | null = null;

  @OneToMany(() => RpsMove, (m) => m.game)
  moves = new Collection<RpsMove>(this);
}
