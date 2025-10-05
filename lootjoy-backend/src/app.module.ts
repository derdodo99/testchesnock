import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { RedisModule } from "../common/adapters/redis/redis.module";
import { HealthModule } from "../common/health/health.module";
import { User } from "./entities/user.entity";
import { Wallet } from "./entities/wallet.entity";
import { WalletsModule } from "./modules/wallets/wallets.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { UsersModule } from "./modules/users/users.module";
import { RpsModule } from "./modules/rps/rps.module";
import { DevAuthMiddleware } from "../common/middlewares/dev-auth.middleware";
import { RpsBotModule } from "./modules/rps-bot/rps-bot.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({}),
    MikroOrmModule.forFeature([User, Wallet]),
    WalletsModule,
    RpsModule,
    RpsBotModule,
    TransactionsModule,
    UsersModule,
    HealthModule,
    RedisModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DevAuthMiddleware).forRoutes("rps", "rps-bot");
  }
}
