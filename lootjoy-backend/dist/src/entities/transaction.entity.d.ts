import { Wallet } from './wallet.entity';
import { AmountType } from '../modules/wallets/constants/amount-type.enum';
export declare class Transaction {
    id: number;
    wallet: Wallet;
    amount: number;
    type: AmountType;
    reason?: string;
    correlationId?: string;
    createdAt?: Date;
}
