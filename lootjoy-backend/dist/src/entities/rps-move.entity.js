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
exports.RpsMove = void 0;
const core_1 = require("@mikro-orm/core");
const rps_game_entity_1 = require("./rps-game.entity");
const user_entity_1 = require("./user.entity");
let RpsMove = class RpsMove {
    id;
    game;
    user;
    commitHash;
    symbol;
    nonce;
    committedAt = new Date();
    revealedAt;
};
exports.RpsMove = RpsMove;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], RpsMove.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => rps_game_entity_1.RpsGame),
    __metadata("design:type", rps_game_entity_1.RpsGame)
], RpsMove.prototype, "game", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], RpsMove.prototype, "user", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], RpsMove.prototype, "commitHash", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], RpsMove.prototype, "symbol", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], RpsMove.prototype, "nonce", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], RpsMove.prototype, "committedAt", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Date)
], RpsMove.prototype, "revealedAt", void 0);
exports.RpsMove = RpsMove = __decorate([
    (0, core_1.Entity)({ tableName: 'rps_moves' })
], RpsMove);
//# sourceMappingURL=rps-move.entity.js.map