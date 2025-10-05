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
exports.RpsGame = void 0;
const core_1 = require("@mikro-orm/core");
const user_entity_1 = require("./user.entity");
const enums_1 = require("../../common/enums");
const rps_move_entity_1 = require("./rps-move.entity");
let RpsGame = class RpsGame {
    id;
    bet;
    status = enums_1.RpsGameStatus.WAITING;
    creator;
    opponent = null;
    createdAt = new Date();
    startedAt;
    finishedAt;
    winner = null;
    moves = new core_1.Collection(this);
};
exports.RpsGame = RpsGame;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], RpsGame.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], RpsGame.prototype, "bet", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', default: enums_1.RpsGameStatus.WAITING }),
    __metadata("design:type", String)
], RpsGame.prototype, "status", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], RpsGame.prototype, "creator", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", Object)
], RpsGame.prototype, "opponent", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], RpsGame.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Date)
], RpsGame.prototype, "startedAt", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Date)
], RpsGame.prototype, "finishedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", Object)
], RpsGame.prototype, "winner", void 0);
__decorate([
    (0, core_1.OneToMany)(() => rps_move_entity_1.RpsMove, (m) => m.game),
    __metadata("design:type", Object)
], RpsGame.prototype, "moves", void 0);
exports.RpsGame = RpsGame = __decorate([
    (0, core_1.Entity)({ tableName: 'rps_games' })
], RpsGame);
//# sourceMappingURL=rps-game.entity.js.map