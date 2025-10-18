export type TxCreateResult =
  | { transactionId: string; idempotent?: false }
  | { transactionId: string; idempotent: true };
