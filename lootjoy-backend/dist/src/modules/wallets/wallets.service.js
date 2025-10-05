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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const postgresql_1 = require("@mikro-orm/postgresql");
const users_service_js_1 = require("../users/users.service.js");
const wallets_repository_js_1 = require("./repository/wallets.repository.js");
const transactions_service_js_1 = require("../transactions/transactions.service.js");
const amount_type_enum_js_1 = require("./constants/amount-type.enum.js");
let WalletsService = class WalletsService {
    em;
    walletRepository;
    transactionsService;
    usersService;
    constructor(em, walletRepository, transactionsService, usersService) {
        this.em = em;
        this.walletRepository = walletRepository;
        this.transactionsService = transactionsService;
        this.usersService = usersService;
    }
    async ensureWalletByTelegramId(telegramId) {
        return this.em.transactional(async (em) => {
            const user = await this.usersService.findByTelegramId(telegramId);
            if (!user)
                throw new common_1.NotFoundException('user not found');
            let wallet = await this.walletRepository.findByUser(user);
            if (!wallet) {
                wallet = this.walletRepository.create(user);
                await em.flush();
            }
            return wallet;
        });
    }
    async getOrCreateWallet(user) {
        let wallet = await this.walletRepository.findByUser(user);
        if (!wallet) {
            wallet = this.walletRepository.create(user);
            await this.em.flush();
        }
        return wallet;
    }
    async balanceByUserId(userId) {
        return this.em.transactional(async (em) => {
            const user = await this.usersService.findById(userId);
            if (!user)
                throw new common_1.NotFoundException('user not found');
            const wallet = await this.walletRepository.findByUser(user);
            return { balance: wallet?.balanceCrystals ?? 0 };
        });
    }
    async credit({ userId, amount, reason, correlationId, type = amount_type_enum_js_1.AmountType.CREDIT, }) {
        console.log(userId, 'userId');
        if (amount <= 0)
            throw new common_1.BadRequestException('amount must be > 0');
        return this.em.transactional(async (em) => {
            const user = await this.usersService.findById(userId);
            if (!user)
                throw new common_1.NotFoundException('user not found');
            let wallet = await this.walletRepository.findByUser(user);
            if (!wallet) {
                wallet = this.walletRepository.create(user);
                await em.flush();
            }
            await em.lock(wallet, postgresql_1.LockMode.PESSIMISTIC_WRITE);
            if (correlationId) {
                console.log(correlationId, 'correlationId');
                const exists = await this.transactionsService.getByCorrelationId(correlationId);
                console.log(exists, 'exists');
                if (exists) {
                    return {
                        balance: wallet.balanceCrystals,
                        transactionId: exists.id,
                        idempotent: true,
                    };
                }
            }
            const result = await this.transactionsService.createIdempotent(wallet, amount, type, { reason, correlationId });
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
    async debit({ userId, amount, reason, correlationId, type = amount_type_enum_js_1.AmountType.DEBIT, }) {
        console.log(amount, 'amount');
        if (amount <= 0)
            throw new common_1.BadRequestException('amount must be > 0');
        return this.em.transactional(async (em) => {
            const user = await this.usersService.findById(userId);
            if (!user)
                throw new common_1.NotFoundException('user not found');
            console.log(user, 'user');
            const wallet = await this.walletRepository.findByUser(user);
            if (!wallet)
                throw new common_1.NotFoundException('wallet not found');
            console.log(wallet, 'wallet');
            if (wallet.balanceCrystals < amount) {
                throw new common_1.BadRequestException('insufficient balance');
            }
            await em.lock(wallet, postgresql_1.LockMode.PESSIMISTIC_WRITE);
            if (correlationId) {
                const exists = await this.transactionsService.getByCorrelationId(correlationId);
                if (exists) {
                    return {
                        balance: wallet.balanceCrystals,
                        transactionId: exists.id,
                        idempotent: true,
                    };
                }
            }
            const tx = await this.transactionsService.createIdempotent(wallet, amount, type, { reason, correlationId });
            wallet.balanceCrystals -= amount;
            await em.persistAndFlush(wallet);
            return {
                balance: wallet.balanceCrystals,
                transactionId: tx.transactionId,
                idempotent: tx.idempotent,
            };
        });
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgresql_1.EntityManager,
        wallets_repository_js_1.WalletsRepository,
        transactions_service_js_1.TransactionsService,
        users_service_js_1.UsersService])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map