import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@src/entities/user.entity';
import { WalletEntity } from '@src/entities/wallet.entity';
import { TransactionEntity } from '@src/entities/transaction.entity';
import { TransactionsService } from '@src/modules/transactions/transactions.service';
import { TransactionsRepository } from '@src/modules/transactions/repository/transactions.repository';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, WalletEntity, TransactionEntity])],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsService],
})
export class TransactionsModule {}
