import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { TransactionsModule } from '../transactions/transactions.module.js';
import { UsersModule } from '../users/users.module.js';
import { WalletsService } from './wallets.service.js';
import { WalletsRepository } from './repository/wallets.repository.js';
import { WalletsController } from './wallets.controller.js';
import { UserEntity } from '@src/entities/user.entity';
import { WalletEntity } from '@src/entities/wallet.entity';
import { TransactionEntity } from '@src/entities/transaction.entity';

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
