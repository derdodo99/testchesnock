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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const transactions_repository_js_1 = require("./repository/transactions.repository.js");
const index_js_1 = require("./constants/index.js");
let TransactionsService = class TransactionsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createIdempotent(wallet, amount, type, opts) {
        const { reason, correlationId } = opts ?? {};
        if (correlationId) {
            const existing = await this.repo.findByCorrelationId(correlationId);
            if (existing) {
                return { transactionId: existing.id, idempotent: true };
            }
        }
        try {
            const tx = await this.repo.create(wallet, amount, type, {
                reason,
                correlationId,
            });
            return { transactionId: tx.id, idempotent: false };
        }
        catch (e) {
            if (correlationId && e?.code === index_js_1.PG_UNIQUE_VIOLATION) {
                const existing = await this.repo.findByCorrelationId(correlationId);
                if (existing)
                    return { transactionId: existing.id, idempotent: true };
            }
            throw e;
        }
    }
    async listForWallet(wallet, limit = 50, offset = 0) {
        return this.repo.listByWallet(wallet, limit, offset);
    }
    async getByCorrelationId(correlationId) {
        return this.repo.findByCorrelationId(correlationId);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactions_repository_js_1.TransactionsRepository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map