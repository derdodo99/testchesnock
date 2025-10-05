import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager, LockMode } from '@mikro-orm/postgresql';
import { UsersService } from '../users/users.service.js';
import { WalletsRepository } from './repository/wallets.repository.js';
import { TransactionsService } from '../transactions/transactions.service.js';
import { CreditOptions } from './types/credit-options.type.js';
import { AmountType } from './constants/amount-type.enum.js';
import { User } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    private readonly em: EntityManager,
    private readonly walletRepository: WalletsRepository,
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
  ) {}

  async ensureWalletByTelegramId(telegramId: string) {
    return this.em.transactional(async (em) => {
      const user = await this.usersService.findByTelegramId(telegramId);
      if (!user) throw new NotFoundException('user not found');

      let wallet = await this.walletRepository.findByUser(user);
      if (!wallet) {
        wallet = this.walletRepository.create(user);
        await em.flush();
      }
      return wallet;
    });
  }
  async getOrCreateWallet(user: User): Promise<Wallet> {
    let wallet = await this.walletRepository.findByUser(user);
    if (!wallet) {
      wallet = this.walletRepository.create(user);
      await this.em.flush();
    }
    return wallet;
  }

  async balanceByUserId(userId: number) {
    return this.em.transactional(async (em) => {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException('user not found');
      const wallet = await this.walletRepository.findByUser(user);
      return { balance: wallet?.balanceCrystals ?? 0 };
    });
  }

  async credit({
    userId,
    amount,
    reason,
    correlationId,
    type = AmountType.CREDIT,
  }: CreditOptions) {
    console.log(userId, 'userId');
    if (amount <= 0) throw new BadRequestException('amount must be > 0');

    return this.em.transactional(async (em) => {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException('user not found');

      let wallet = await this.walletRepository.findByUser(user);
      if (!wallet) {
        wallet = this.walletRepository.create(user);
        await em.flush();
      }

      await em.lock(wallet, LockMode.PESSIMISTIC_WRITE);

      if (correlationId) {
        console.log(correlationId, 'correlationId');
        const exists =
          await this.transactionsService.getByCorrelationId(correlationId);
        console.log(exists, 'exists');
        if (exists) {
          return {
            balance: wallet.balanceCrystals,
            transactionId: exists.id,
            idempotent: true,
          };
        }
      }

      const result = await this.transactionsService.createIdempotent(
        wallet,
        amount,
        type,
        { reason, correlationId },
      );

      wallet.balanceCrystals += amount;
      this.walletRepository.persist(wallet);
      await em.flush();

      return {
        balance: wallet.balanceCrystals,
        transactionId: result.transactionId,
        idempotent: result.idempotent,
      };
    });
  }

  async debit({
    userId,
    amount,
    reason,
    correlationId,
    type = AmountType.DEBIT,
  }: CreditOptions) {
    console.log(amount, 'amount');
    if (amount <= 0) throw new BadRequestException('amount must be > 0');

    return this.em.transactional(async (em) => {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException('user not found');
      console.log(user, 'user');
      const wallet = await this.walletRepository.findByUser(user);
      if (!wallet) throw new NotFoundException('wallet not found');
      console.log(wallet, 'wallet');
      if (wallet.balanceCrystals < amount) {
        throw new BadRequestException('insufficient balance');
      }
      await em.lock(wallet, LockMode.PESSIMISTIC_WRITE);
      if (correlationId) {
        const exists =
          await this.transactionsService.getByCorrelationId(correlationId);
        if (exists) {
          return {
            balance: wallet.balanceCrystals,
            transactionId: exists.id,
            idempotent: true,
          };
        }
      }

      const tx = await this.transactionsService.createIdempotent(
        wallet,
        amount,
        type,
        { reason, correlationId },
      );
      wallet.balanceCrystals -= amount;

      await em.persistAndFlush(wallet);
      return {
        balance: wallet.balanceCrystals,
        transactionId: tx.transactionId,
        idempotent: tx.idempotent,
      };
    });
  }
}
