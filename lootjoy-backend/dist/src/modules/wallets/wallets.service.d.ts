import { EntityManager } from '@mikro-orm/postgresql';
import { UsersService } from '../users/users.service.js';
import { WalletsRepository } from './repository/wallets.repository.js';
import { TransactionsService } from '../transactions/transactions.service.js';
import { CreditOptions } from './types/credit-options.type.js';
import { User } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';
export declare class WalletsService {
    private readonly em;
    private readonly walletRepository;
    private readonly transactionsService;
    private readonly usersService;
    constructor(em: EntityManager, walletRepository: WalletsRepository, transactionsService: TransactionsService, usersService: UsersService);
    ensureWalletByTelegramId(telegramId: string): Promise<Wallet>;
    getOrCreateWallet(user: User): Promise<Wallet>;
    balanceByUserId(userId: number): Promise<{
        balance: number;
    }>;
    credit({ userId, amount, reason, correlationId, type, }: CreditOptions): Promise<{
        balance: number;
        transactionId: number;
        idempotent: boolean | undefined;
    }>;
    debit({ userId, amount, reason, correlationId, type, }: CreditOptions): Promise<{
        balance: number;
        transactionId: number;
        idempotent: boolean | undefined;
    }>;
}
