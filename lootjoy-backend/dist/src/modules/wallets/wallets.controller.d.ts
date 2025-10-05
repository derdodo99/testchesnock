import { WalletsService } from './wallets.service.js';
import { AmountDto } from './dto/amount.dto.js';
export declare class WalletsController {
    private readonly wallets;
    constructor(wallets: WalletsService);
    balance(userId: number): Promise<{
        balance: number;
    }>;
    credit(userId: number, dto: AmountDto): Promise<{
        balance: number;
        transactionId: number;
        idempotent: boolean | undefined;
    }>;
    debit(userId: number, dto: AmountDto): Promise<{
        balance: number;
        transactionId: number;
        idempotent: boolean | undefined;
    }>;
}
