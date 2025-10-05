"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpsBotModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const rps_bot_game_entity_1 = require("../../entities/rps-bot-game.entity");
const rps_bot_move_entity_1 = require("../../entities/rps-bot-move.entity");
const user_entity_1 = require("../../entities/user.entity");
const redis_module_1 = require("../../../common/adapters/redis/redis.module");
const rps_bot_controller_1 = require("./rps-bot.controller");
const ps_bot_service_1 = require("./ps-bot.service");
let RpsBotModule = class RpsBotModule {
};
exports.RpsBotModule = RpsBotModule;
exports.RpsBotModule = RpsBotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisModule,
            nestjs_1.MikroOrmModule.forFeature([rps_bot_game_entity_1.RpsBotGame, rps_bot_move_entity_1.RpsBotMove, user_entity_1.User]),
        ],
        controllers: [rps_bot_controller_1.RpsBotController],
        providers: [ps_bot_service_1.RpsBotService],
        exports: [ps_bot_service_1.RpsBotService],
    })
], RpsBotModule);
//# sourceMappingURL=rps-bot.module.js.map