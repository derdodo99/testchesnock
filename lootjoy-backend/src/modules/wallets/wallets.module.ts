import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@src/entities/user.entity';
import { WalletEntity } from '@src/entities/wallet.entity';
import { TransactionEntity } from '@src/entities/transaction.entity';
import { TransactionsModule } from '@src/modules/transactions/transactions.module';
import { UsersModule } from '@src/modules/users/users.module';
import { WalletsService } from '@src/modules/wallets/wallets.service';
import { WalletsRepository } from '@src/modules/wallets/repository/wallets.repository';
import { WalletsController } from '@src/modules/wallets/wallets.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity, WalletEntity, TransactionEntity]),
    TransactionsModule,
    UsersModule,
  ],
  providers: [WalletsService, WalletsRepository],
  controllers: [WalletsController],
  exports: [WalletsService],
})
export class WalletsModule {}
