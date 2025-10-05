import { TransactionsRepository } from './repository/transactions.repository.js';
import { Wallet } from '../../entities/wallet.entity.js';
import { AmountType } from '../wallets/constants/amount-type.enum.js';
import { TxCreateResult } from './types/tx-create-result.type.js';
export declare class TransactionsService {
    private readonly repo;
    constructor(repo: TransactionsRepository);
    createIdempotent(wallet: Wallet, amount: number, type: AmountType, opts?: {
        reason?: string;
        correlationId?: string;
    }): Promise<TxCreateResult>;
    listForWallet(wallet: Wallet, limit?: number, offset?: number): Promise<import("../../entities/transaction.entity.js").Transaction[]>;
    getByCorrelationId(correlationId: string): Promise<import("../../entities/transaction.entity.js").Transaction | null>;
}
