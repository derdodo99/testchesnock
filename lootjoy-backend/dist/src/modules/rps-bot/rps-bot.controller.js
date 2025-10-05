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
exports.RpsBotController = void 0;
const common_1 = require("@nestjs/common");
const auth_user_decorator_1 = require("../../auth/decorators/auth-user.decorator");
const ps_bot_service_1 = require("./ps-bot.service");
let RpsBotController = class RpsBotController {
    service;
    constructor(service) {
        this.service = service;
    }
    start(userId) {
        return this.service.start(userId);
    }
    commit(userId, body) {
        return this.service.commit(userId, body.gameId, body.commitHash);
    }
    reveal(userId, body) {
        return this.service.reveal(userId, body.gameId, body.symbol, body.nonce);
    }
    state(gameId) {
        return this.service.state(gameId);
    }
};
exports.RpsBotController = RpsBotController;
__decorate([
    (0, common_1.Post)("start"),
    __param(0, (0, auth_user_decorator_1.AuthUser)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RpsBotController.prototype, "start", null);
__decorate([
    (0, common_1.Post)("commit"),
    __param(0, (0, auth_user_decorator_1.AuthUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RpsBotController.prototype, "commit", null);
__decorate([
    (0, common_1.Post)("reveal"),
    __param(0, (0, auth_user_decorator_1.AuthUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RpsBotController.prototype, "reveal", null);
__decorate([
    (0, common_1.Get)("state/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RpsBotController.prototype, "state", null);
exports.RpsBotController = RpsBotController = __decorate([
    (0, common_1.Controller)("rps-bot"),
    __metadata("design:paramtypes", [ps_bot_service_1.RpsBotService])
], RpsBotController);
//# sourceMappingURL=rps-bot.controller.js.map