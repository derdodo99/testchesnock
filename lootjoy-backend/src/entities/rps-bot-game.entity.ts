import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';

import { RpsBotMoveEntity } from './rps-bot-move.entity';
import { RpsGameStatus } from '../../common/enums';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ tableName: 'rps_bot_games' })
export class RpsBotGameEntity {
  @PrimaryKey() id!: string; // uuid

  @Property({ default: 0 }) bet: number = 0;
  @Property({ default: RpsGameStatus.WAITING }) status: RpsGameStatus = RpsGameStatus.WAITING;
  @Property({ default: false }) botWon: boolean = false; // если бот победил
  @Property() createdAt: Date = new Date();
  @Property({ nullable: true }) startedAt?: Date;
  @Property({ nullable: true }) finishedAt?: Date;

  @ManyToOne(() => UserEntity) player!: UserEntity;
  @ManyToOne(() => UserEntity, { nullable: true }) winner: UserEntity | null = null;
  @OneToMany(() => RpsBotMoveEntity, (m) => m.game) moves = new Collection<RpsBotMoveEntity>(this);
}
