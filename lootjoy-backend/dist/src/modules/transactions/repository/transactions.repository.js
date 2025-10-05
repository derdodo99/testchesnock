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
exports.TransactionsRepository = void 0;
const common_1 = require("@nestjs/common");
const postgresql_1 = require("@mikro-orm/postgresql");
const transaction_entity_1 = require("../../../entities/transaction.entity");
let TransactionsRepository = class TransactionsRepository {
    em;
    constructor(em) {
        this.em = em;
    }
    async findById(id) {
        return this.em.findOne(transaction_entity_1.Transaction, { id });
    }
    async findByCorrelationId(correlationId) {
        return this.em.findOne(transaction_entity_1.Transaction, { correlationId });
    }
    async listByWallet(wallet, limit = 50, offset = 0) {
        return this.em.find(transaction_entity_1.Transaction, { wallet }, { orderBy: { createdAt: 'DESC' }, limit, offset });
    }
    async create(wallet, amount, type, options) {
        const tx = this.em.create(transaction_entity_1.Transaction, {
            wallet,
            amount,
            type,
            reason: options?.reason,
            correlationId: options?.correlationId,
        });
        await this.em.persistAndFlush(tx);
        return tx;
    }
};
exports.TransactionsRepository = TransactionsRepository;
exports.TransactionsRepository = TransactionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgresql_1.EntityManager])
], TransactionsRepository);
//# sourceMappingURL=transactions.repository.js.map