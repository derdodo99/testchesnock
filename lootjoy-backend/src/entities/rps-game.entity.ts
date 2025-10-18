import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { UserEntity } from '@src/entities/user.entity';
import { RpsMoveEntity } from '@src/entities/rps-move.entity';
import { RpsGameStatus } from '@root/common/enums'; // у тебя уже есть

@Entity({ tableName: 'rps_games' })
export class RpsGameEntity {
  @PrimaryKey()
  id!: string; // uuid

  @Property()
  bet!: number; // в кристаллах

  @Property({ type: 'string', default: RpsGameStatus.WAITING })
  status: RpsGameStatus = RpsGameStatus.WAITING;

  @ManyToOne(() => UserEntity)
  creator!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  opponent: UserEntity | null = null;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  startedAt?: Date;

  @Property({ nullable: true })
  finishedAt?: Date;

  @ManyToOne(() => UserEntity, { nullable: true })
  winner: UserEntity | null = null;

  @OneToMany(() => RpsMoveEntity, (m) => m.game)
  moves = new Collection<RpsMoveEntity>(this);
}
