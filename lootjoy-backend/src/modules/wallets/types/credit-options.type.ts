import { AmountType } from '@src/modules/wallets/constants/amount-type.enum';

export interface CreditOptions {
  userId: string;
  amount: number;
  reason?: string;
  correlationId?: string;
  type?: AmountType;
}
