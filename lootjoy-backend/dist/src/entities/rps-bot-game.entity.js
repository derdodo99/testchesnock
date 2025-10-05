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
exports.RpsBotGame = void 0;
const core_1 = require("@mikro-orm/core");
const user_entity_1 = require("./user.entity");
const rps_bot_move_entity_1 = require("./rps-bot-move.entity");
const enums_1 = require("../../common/enums");
let RpsBotGame = class RpsBotGame {
    id;
    bet = 0;
    status = enums_1.RpsGameStatus.WAITING;
    botWon = false;
    createdAt = new Date();
    startedAt;
    finishedAt;
    player;
    winner = null;
    moves = new core_1.Collection(this);
};
exports.RpsBotGame = RpsBotGame;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], RpsBotGame.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ default: 0 }),
    __metadata("design:type", Number)
], RpsBotGame.prototype, "bet", void 0);
__decorate([
    (0, core_1.Property)({ default: enums_1.RpsGameStatus.WAITING }),
    __metadata("design:type", String)
], RpsBotGame.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ default: false }),
    __metadata("design:type", Boolean)
], RpsBotGame.prototype, "botWon", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], RpsBotGame.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Date)
], RpsBotGame.prototype, "startedAt", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Date)
], RpsBotGame.prototype, "finishedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], RpsBotGame.prototype, "player", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", Object)
], RpsBotGame.prototype, "winner", void 0);
__decorate([
    (0, core_1.OneToMany)(() => rps_bot_move_entity_1.RpsBotMove, (m) => m.game),
    __metadata("design:type", Object)
], RpsBotGame.prototype, "moves", void 0);
exports.RpsBotGame = RpsBotGame = __decorate([
    (0, core_1.Entity)({ tableName: "rps_bot_games" })
], RpsBotGame);
//# sourceMappingURL=rps-bot-game.entity.js.map