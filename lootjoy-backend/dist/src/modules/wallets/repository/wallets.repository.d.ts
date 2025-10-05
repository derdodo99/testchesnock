import { EntityManager } from '@mikro-orm/postgresql';
import { Wallet } from '../../../entities/wallet.entity.js';
import { User } from '../../../entities/user.entity.js';
export declare class WalletsRepository {
    private readonly em;
    constructor(em: EntityManager);
    findByUser(user: User): Promise<Wallet | null>;
    create(user: User): Wallet;
    persist(wallet: Wallet): void;
}
