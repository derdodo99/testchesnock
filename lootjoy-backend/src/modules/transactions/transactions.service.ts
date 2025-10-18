import { Injectable } from '@nestjs/common';
import { WalletEntity } from '@src/entities/wallet.entity';
import { TransactionsRepository } from '@src/modules/transactions/repository/transactions.repository';
import { AmountType } from '@src/modules/wallets/constants/amount-type.enum';
import { TxCreateResult } from '@src/modules/transactions/types/tx-create-result.type';
import { PG_UNIQUE_VIOLATION } from '@src/modules/transactions/constants';

@Injectable()
export class TransactionsService {
  constructor(private readonly repo: TransactionsRepository) {}

  /**
   * Идемпотентное создание транзакции.
   * Если передан correlationId и такая транзакция уже существует — вернёт её id и флаг idempotent.
   */
  async createIdempotent(
    wallet: WalletEntity,
    amount: number,
    type: AmountType,
    opts?: { reason?: string; correlationId?: string },
  ): Promise<TxCreateResult> {
    const { reason, correlationId } = opts ?? {};

    if (correlationId) {
      const existing = await this.repo.findByCorrelationId(correlationId);
      if (existing) {
        return { transactionId: existing.id, idempotent: true };
      }
    }

    try {
      const tx = await this.repo.create(wallet, amount, type, {
        reason,
        correlationId,
      });
      return { transactionId: tx.id, idempotent: false as const };
    } catch (e: any) {
      // конфликт по уникальному индексу (correlation_id)
      if (correlationId && e?.code === PG_UNIQUE_VIOLATION) {
        const existing = await this.repo.findByCorrelationId(correlationId);
        if (existing) return { transactionId: existing.id, idempotent: true };
      }
      throw e;
    }
  }

  async listForWallet(wallet: WalletEntity, limit = 50, offset = 0) {
    return this.repo.listByWallet(wallet, limit, offset);
  }

  async getByCorrelationId(correlationId: string) {
    return this.repo.findByCorrelationId(correlationId);
  }
}
