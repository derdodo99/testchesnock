import { RpsBotGame } from "./rps-bot-game.entity";
import type { RpsSymbol } from "../../common/types";
import { User } from "./user.entity";
export declare class RpsBotMove {
    id: string;
    commitHash: string;
    symbol?: RpsSymbol;
    nonce?: string;
    committedAt: Date;
    revealedAt?: Date;
    game: RpsBotGame;
    user: User;
}
