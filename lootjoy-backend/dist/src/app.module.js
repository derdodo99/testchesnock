"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_1 = require("@mikro-orm/nestjs");
const redis_module_1 = require("../common/adapters/redis/redis.module");
const health_module_1 = require("../common/health/health.module");
const user_entity_1 = require("./entities/user.entity");
const wallet_entity_1 = require("./entities/wallet.entity");
const wallets_module_1 = require("./modules/wallets/wallets.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const users_module_1 = require("./modules/users/users.module");
const rps_module_1 = require("./modules/rps/rps.module");
const dev_auth_middleware_1 = require("../common/middlewares/dev-auth.middleware");
const rps_bot_module_1 = require("./modules/rps-bot/rps-bot.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(dev_auth_middleware_1.DevAuthMiddleware).forRoutes("rps", "rps-bot");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            nestjs_1.MikroOrmModule.forRoot({}),
            nestjs_1.MikroOrmModule.forFeature([user_entity_1.User, wallet_entity_1.Wallet]),
            wallets_module_1.WalletsModule,
            rps_module_1.RpsModule,
            rps_bot_module_1.RpsBotModule,
            transactions_module_1.TransactionsModule,
            users_module_1.UsersModule,
            health_module_1.HealthModule,
            redis_module_1.RedisModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map