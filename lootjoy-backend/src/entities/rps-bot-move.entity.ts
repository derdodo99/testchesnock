import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { RpsBotGame } from "./rps-bot-game.entity";
import type { RpsSymbol } from "../../common/types";
import { User } from "./user.entity";

@Entity({ tableName: "rps_bot_moves" })
export class RpsBotMove {
  @PrimaryKey() id!: string;

  @Property() commitHash!: string;
  @Property({ nullable: true }) symbol?: RpsSymbol;
  @Property({ nullable: true }) nonce?: string;
  @Property() committedAt: Date = new Date();
  @Property({ nullable: true }) revealedAt?: Date;

  @ManyToOne(() => RpsBotGame) game!: RpsBotGame;
  @ManyToOne(() => User) user!: User;
}
