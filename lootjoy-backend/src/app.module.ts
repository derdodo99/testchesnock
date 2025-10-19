import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@src/entities/user.entity';
import { WalletEntity } from '@src/entities/wallet.entity';
import { WalletsModule } from '@src/modules/wallets/wallets.module';
import { RpsModule } from '@src/modules/rps/rps.module';
import { RpsBotModule } from '@src/modules/rps-bot/rps-bot.module';
import { TransactionsModule } from '@src/modules/transactions/transactions.module';
import { UsersModule } from '@src/modules/users/users.module';
import { HealthModule } from '@root/common/health/health.module';
import { RedisModule } from '@root/common/adapters/redis/redis.module';
import { DevAuthMiddleware } from '@root/common/middlewares/dev-auth.middleware';
import { SpinsModule } from '@src/modules/spins/spins.module';
import { TelegramModule } from '@src/telegram/telegram.module';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({}),
    MikroOrmModule.forFeature([UserEntity, WalletEntity]),
    AuthModule,
    TelegramModule,
    WalletsModule,
    RpsModule,
    RpsBotModule,
    TransactionsModule,
    UsersModule,
    HealthModule,
    RedisModule,
    SpinsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DevAuthMiddleware).forRoutes('rps', 'rps-bot');
  }
}
