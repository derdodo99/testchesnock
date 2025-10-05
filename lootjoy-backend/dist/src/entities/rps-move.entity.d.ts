import { RpsGame } from './rps-game.entity';
import { User } from './user.entity';
import type { RpsSymbol } from '../../common/types';
export declare class RpsMove {
    id: string;
    game: RpsGame;
    user: User;
    commitHash: string;
    symbol?: RpsSymbol;
    nonce?: string;
    committedAt: Date;
    revealedAt?: Date;
}
