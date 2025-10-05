import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { User } from "./user.entity";
import { RpsBotMove } from "./rps-bot-move.entity";
import { RpsGameStatus } from "../../common/enums";

@Entity({ tableName: "rps_bot_games" })
export class RpsBotGame {
  @PrimaryKey() id!: string; // uuid

  @Property({ default: 0 }) bet: number = 0;
  @Property({ default: RpsGameStatus.WAITING }) status: RpsGameStatus =
    RpsGameStatus.WAITING;
  @Property({ default: false }) botWon: boolean = false; // если бот победил
  @Property() createdAt: Date = new Date();
  @Property({ nullable: true }) startedAt?: Date;
  @Property({ nullable: true }) finishedAt?: Date;

  @ManyToOne(() => User) player!: User;
  @ManyToOne(() => User, { nullable: true }) winner: User | null = null;
  @OneToMany(() => RpsBotMove, (m) => m.game) moves =
    new Collection<RpsBotMove>(this);
}
