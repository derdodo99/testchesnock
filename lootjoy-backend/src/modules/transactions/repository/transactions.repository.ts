import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { TransactionEntity } from '@src/entities/transaction.entity';
import { WalletEntity } from '@src/entities/wallet.entity';
import { AmountType } from '@src/modules/wallets/constants/amount-type.enum';
import { CreateOptions } from '@src/modules/transactions/types/create-options.type';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<TransactionEntity | null> {
    return this.em.findOne(TransactionEntity, { id });
  }

  async findByCorrelationId(correlationId: string): Promise<TransactionEntity | null> {
    return this.em.findOne(TransactionEntity, { correlationId });
  }

  async listByWallet(wallet: WalletEntity, limit = 50, offset = 0): Promise<TransactionEntity[]> {
    return this.em.find(
      TransactionEntity,
      { wallet },
      { orderBy: { createdAt: 'DESC' }, limit, offset },
    );
  }

  /**
   * Создаёт транзакцию БЕЗ изменения баланса (балансом занимается WalletsService).
   * Здесь — только запись в журнал.
   */
  async create(
    wallet: WalletEntity,
    amount: number,
    type: AmountType,
    options?: CreateOptions,
  ): Promise<TransactionEntity> {
    const tx = this.em.create(TransactionEntity, {
      wallet,
      amount,
      type,
      reason: options?.reason,
      correlationId: options?.correlationId,
    });
    await this.em.persistAndFlush(tx);
    return tx;
  }
}
