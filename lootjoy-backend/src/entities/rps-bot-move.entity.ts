import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserEntity } from '@src/entities/user.entity';
import type { RpsSymbol } from '@root/common/types';
import { RpsBotGameEntity } from '@src/entities/rps-bot-game.entity';

@Entity({ tableName: 'rps_bot_moves' })
export class RpsBotMoveEntity {
  @PrimaryKey() id: string = crypto.randomUUID();

  @Property() commitHash!: string;
  @Property({ nullable: true }) symbol?: RpsSymbol;
  @Property({ nullable: true }) nonce?: string;
  @Property() committedAt: Date = new Date();
  @Property({ nullable: true }) revealedAt?: Date;

  @ManyToOne(() => RpsBotGameEntity) game!: RpsBotGameEntity;
  @ManyToOne(() => UserEntity) user!: UserEntity;
}
