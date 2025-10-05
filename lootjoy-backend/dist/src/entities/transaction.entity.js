"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const core_1 = require("@mikro-orm/core");
const wallet_entity_1 = require("./wallet.entity");
const amount_type_enum_1 = require("../modules/wallets/constants/amount-type.enum");
let Transaction = class Transaction {
    id;
    wallet;
    amount;
    type;
    reason;
    correlationId;
    createdAt = new Date();
};
exports.Transaction = Transaction;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => wallet_entity_1.Wallet),
    (0, core_1.Index)({ name: 'transactions_wallet_id_idx' }),
    __metadata("design:type", wallet_entity_1.Wallet)
], Transaction.prototype, "wallet", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => amount_type_enum_1.AMOUNT_TYPES, type: 'string' }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "reason", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    (0, core_1.Unique)({
        name: 'transactions_correlation_id_uq',
        expression: 'unique ("correlation_id") where "correlation_id" is not null',
    }),
    __metadata("design:type", String)
], Transaction.prototype, "correlationId", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date() }),
    (0, core_1.Index)({ name: 'transactions_created_at_idx' }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
exports.Transaction = Transaction = __decorate([
    (0, core_1.Entity)({ tableName: 'transactions' })
], Transaction);
//# sourceMappingURL=transaction.entity.js.map