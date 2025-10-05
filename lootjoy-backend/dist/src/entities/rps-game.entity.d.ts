import { Collection } from '@mikro-orm/core';
import { User } from './user.entity';
import { RpsGameStatus } from '../../common/enums';
import { RpsMove } from './rps-move.entity';
export declare class RpsGame {
    id: string;
    bet: number;
    status: RpsGameStatus;
    creator: User;
    opponent: User | null;
    createdAt: Date;
    startedAt?: Date;
    finishedAt?: Date;
    winner: User | null;
    moves: Collection<RpsMove, object>;
}
