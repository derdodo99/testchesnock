import { EntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../../../entities/transaction.entity';
import { Wallet } from '../../../entities/wallet.entity';
import { AmountType } from '../../wallets/constants/amount-type.enum';
import { CreateOptions } from '../types/create-options.type';
export declare class TransactionsRepository {
    private readonly em;
    constructor(em: EntityManager);
    findById(id: number): Promise<Transaction | null>;
    findByCorrelationId(correlationId: string): Promise<Transaction | null>;
    listByWallet(wallet: Wallet, limit?: number, offset?: number): Promise<Transaction[]>;
    create(wallet: Wallet, amount: number, type: AmountType, options?: CreateOptions): Promise<Transaction>;
}
