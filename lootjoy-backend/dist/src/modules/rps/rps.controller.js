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
exports.RpsController = void 0;
const common_1 = require("@nestjs/common");
const rps_service_1 = require("./rps.service");
const dto_1 = require("../../../common/dto");
const auth_user_decorator_1 = require("../../auth/decorators/auth-user.decorator");
let RpsController = class RpsController {
    service;
    constructor(service) {
        this.service = service;
    }
    join(userId, dto) {
        return this.service.joinQueue(userId, dto.bet);
    }
    createPrivate(userId, dto) {
        return this.service.createPrivate(userId, dto.opponentId, dto.bet);
    }
    commit(userId, dto) {
        return this.service.commit(userId, dto.gameId, dto.commitHash);
    }
    reveal(userId, dto) {
        return this.service.reveal(userId, dto.gameId, dto.symbol, dto.nonce);
    }
    state(p) {
    }
};
exports.RpsController = RpsController;
__decorate([
    (0, common_1.Post)("queue"),
    __param(0, (0, auth_user_decorator_1.AuthUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.QueueDto]),
    __metadata("design:returntype", void 0)
], RpsController.prototype, "join", null);
__decorate([
    (0, common_1.Post)("duel"),
    __param(0, (0, auth_user_decorator_1.AuthUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreatePrivateDto]),
    __metadata("design:returntype", void 0)
], RpsController.prototype, "createPrivate", null);
__decorate([
    (0, common_1.Post)("commit"),
    __param(0, (0, auth_user_decorator_1.AuthUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CommitDto]),
    __metadata("design:returntype", void 0)
], RpsController.prototype, "commit", null);
__decorate([
    (0, common_1.Post)("reveal"),
    __param(0, (0, auth_user_decorator_1.AuthUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.RevealDto]),
    __metadata("design:returntype", void 0)
], RpsController.prototype, "reveal", null);
__decorate([
    (0, common_1.Get)("state/:gameId"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StateParams]),
    __metadata("design:returntype", void 0)
], RpsController.prototype, "state", null);
exports.RpsController = RpsController = __decorate([
    (0, common_1.Controller)("rps"),
    __metadata("design:paramtypes", [rps_service_1.RpsService])
], RpsController);
//# sourceMappingURL=rps.controller.js.map