"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const user_entity_js_1 = require("../../entities/user.entity.js");
const wallet_entity_js_1 = require("../../entities/wallet.entity.js");
const transaction_entity_js_1 = require("../../entities/transaction.entity.js");
const transactions_module_js_1 = require("../transactions/transactions.module.js");
const users_module_js_1 = require("../users/users.module.js");
const wallets_service_js_1 = require("./wallets.service.js");
const wallets_repository_js_1 = require("./repository/wallets.repository.js");
const wallets_controller_js_1 = require("./wallets.controller.js");
let WalletsModule = class WalletsModule {
};
exports.WalletsModule = WalletsModule;
exports.WalletsModule = WalletsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.MikroOrmModule.forFeature([user_entity_js_1.User, wallet_entity_js_1.Wallet, transaction_entity_js_1.Transaction]),
            transactions_module_js_1.TransactionsModule,
            users_module_js_1.UsersModule,
        ],
        providers: [wallets_service_js_1.WalletsService, wallets_repository_js_1.WalletsRepository],
        controllers: [wallets_controller_js_1.WalletsController],
        exports: [wallets_service_js_1.WalletsService],
    })
], WalletsModule);
//# sourceMappingURL=wallets.module.js.map