import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { RpsBotGameEntity } from './rps-bot-game.entity';
import type { RpsSymbol } from '../../common/types';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ tableName: 'rps_bot_moves' })
export class RpsBotMoveEntity {
  @PrimaryKey() id!: string;

  @Property() commitHash!: string;
  @Property({ nullable: true }) symbol?: RpsSymbol;
  @Property({ nullable: true }) nonce?: string;
  @Property() committedAt: Date = new Date();
  @Property({ nullable: true }) revealedAt?: Date;

  @ManyToOne(() => RpsBotGameEntity) game!: RpsBotGameEntity;
  @ManyToOne(() => UserEntity) user!: UserEntity;
}
