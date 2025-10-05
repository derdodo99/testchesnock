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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsController = void 0;
const common_1 = require("@nestjs/common");
const wallets_service_js_1 = require("./wallets.service.js");
const amount_dto_js_1 = require("./dto/amount.dto.js");
let WalletsController = class WalletsController {
    wallets;
    constructor(wallets) {
        this.wallets = wallets;
    }
    balance(userId) {
        return this.wallets.balanceByUserId(userId);
    }
    credit(userId, dto) {
        return this.wallets.credit({
            userId,
            amount: dto.amount,
            reason: dto.reason,
            correlationId: dto.cid,
            type: dto.type,
        });
    }
    debit(userId, dto) {
        return this.wallets.debit({
            userId,
            amount: dto.amount,
            reason: dto.reason,
            correlationId: dto.cid,
            type: dto.type,
        });
    }
};
exports.WalletsController = WalletsController;
__decorate([
    (0, common_1.Get)(':userId/balance'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "balance", null);
__decorate([
    (0, common_1.Post)(':userId/credit'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, amount_dto_js_1.AmountDto]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "credit", null);
__decorate([
    (0, common_1.Post)(':userId/debit'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, amount_dto_js_1.AmountDto]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "debit", null);
exports.WalletsController = WalletsController = __decorate([
    (0, common_1.Controller)('wallets'),
    __metadata("design:paramtypes", [wallets_service_js_1.WalletsService])
], WalletsController);
//# sourceMappingURL=wallets.controller.js.map