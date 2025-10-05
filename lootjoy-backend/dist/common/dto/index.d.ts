export declare class QueueDto {
    bet: number;
}
export declare class CreatePrivateDto {
    bet: number;
    opponentId: number;
}
export declare class CommitDto {
    gameId: string;
    commitHash: string;
}
export declare class RevealDto {
    gameId: string;
    symbol: 'rock' | 'paper' | 'scissors';
    nonce: string;
}
export declare class StateParams {
    gameId: string;
}
