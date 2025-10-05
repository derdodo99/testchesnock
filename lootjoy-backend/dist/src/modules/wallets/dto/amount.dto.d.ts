import { AmountType } from '../constants/amount-type.enum.js';
export declare class AmountDto {
    amount: number;
    reason?: string;
    type?: AmountType;
    cid?: string;
}
