import { Entity, PrimaryKey, Property, ManyToOne, Index, Unique, Enum } from '@mikro-orm/core';
import { WalletEntity } from '@src/entities/wallet.entity';
import { AMOUNT_TYPES, AmountType } from '@src/modules/wallets/constants/amount-type.enum';

@Entity({ tableName: 'transactions' })
export class TransactionEntity {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @ManyToOne(() => WalletEntity)
  @Index({ name: 'transactions_wallet_id_idx' })
  wallet!: WalletEntity;

  @Property()
  amount!: number;

  @Enum({ items: () => AMOUNT_TYPES, type: 'string' })
  type!: AmountType;

  @Property({ nullable: true })
  reason?: string;

  @Property({ nullable: true })
  @Unique({
    name: 'transactions_correlation_id_uq',
    expression: 'unique ("correlation_id") where "correlation_id" is not null',
  })
  correlationId?: string;

  @Property({ onCreate: () => new Date() })
  @Index({ name: 'transactions_created_at_idx' })
  createdAt?: Date = new Date();
}
