import { RpsBotService } from "./ps-bot.service";
export declare class RpsBotController {
    private readonly service;
    constructor(service: RpsBotService);
    start(userId: number): Promise<{
        gameId: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    commit(userId: number, body: {
        gameId: string;
        commitHash: string;
    }): Promise<{
        ok: boolean;
    }>;
    reveal(userId: number, body: {
        gameId: string;
        symbol: "rock" | "paper" | "scissors";
        nonce: string;
    }): Promise<{
        ok: boolean;
    }>;
    state(gameId: string): Promise<{
        id: string;
        bet: number;
        status: import("../../../common/enums").RpsGameStatus;
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
}
