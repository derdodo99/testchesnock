import { EntityManager } from "@mikro-orm/core";
import type Redis from "ioredis";
import { RpsGameStatus } from "../../../common/enums";
import { RpsSymbol } from "../../../common/types";
export declare class RpsBotService {
    private readonly em;
    private readonly redis;
    constructor(em: EntityManager, redis: Redis);
    start(userId?: number): Promise<{
        gameId: `${string}-${string}-${string}-${string}-${string}`;
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
        botWon: boolean;
        players: {
            playerId: number;
            botId: number;
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
    private pick;
}
