"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const user_entity_js_1 = require("../../entities/user.entity.js");
const wallet_entity_js_1 = require("../../entities/wallet.entity.js");
const transaction_entity_js_1 = require("../../entities/transaction.entity.js");
const transactions_service_js_1 = require("./transactions.service.js");
const transactions_repository_js_1 = require("./repository/transactions.repository.js");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forFeature([user_entity_js_1.User, wallet_entity_js_1.Wallet, transaction_entity_js_1.Transaction])],
        providers: [transactions_service_js_1.TransactionsService, transactions_repository_js_1.TransactionsRepository],
        exports: [transactions_service_js_1.TransactionsService],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map