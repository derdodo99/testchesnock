import { User } from './user.entity';
export declare class Wallet {
    id: number;
    user: User;
    balanceCrystals: number;
    createdAt?: Date;
    updatedAt?: Date;
}
