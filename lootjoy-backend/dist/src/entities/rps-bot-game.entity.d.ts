import { Collection } from "@mikro-orm/core";
import { User } from "./user.entity";
import { RpsBotMove } from "./rps-bot-move.entity";
import { RpsGameStatus } from "../../common/enums";
export declare class RpsBotGame {
    id: string;
    bet: number;
    status: RpsGameStatus;
    botWon: boolean;
    createdAt: Date;
    startedAt?: Date;
    finishedAt?: Date;
    player: User;
    winner: User | null;
    moves: Collection<RpsBotMove, object>;
}
