import { EntityManager } from "@mikro-orm/core";
import { Redis } from "ioredis";
import { WalletsService } from "../wallets/wallets.service";
import { RpsGameStatus } from "../../../common/enums";
import { RpsSymbol } from "../../../common/types";
export declare class RpsService {
    private readonly em;
    private readonly redis;
    private readonly wallets;
    constructor(em: EntityManager, redis: Redis, wallets: WalletsService);
    joinQueue(userId: number, bet: number): Promise<{
        queued: boolean;
        gameId: string;
    } | {
        queued: boolean;
    }>;
    createPrivate(userId: number, opponentId: number, bet: number): Promise<{
        gameId: string;
    }>;
    commit(userId: number, gameId: string, commitHash: string): Promise<{
        ok: boolean;
    }>;
    reveal(userId: number, gameId: string, symbol: RpsSymbol, nonce: string): Promise<{
        ok: boolean;
    }>;
    state(gameId: string): Promise<{
        id: string;
        bet: number;
        status: RpsGameStatus;
        players: {
            creatorId: number;
            opponentId: number | null;
            winnerId: number | null;
        };
        moves: {
            userId: number;
            committed: boolean;
            revealed: boolean;
        }[];
        createdAt: Date;
        startedAt: Date | undefined;
        finishedAt: Date | undefined;
    }>;
    private settle;
}
