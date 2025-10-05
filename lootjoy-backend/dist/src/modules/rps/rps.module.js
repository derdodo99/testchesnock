"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpsModule = void 0;
const common_1 = require("@nestjs/common");
const rps_service_1 = require("./rps.service");
const rps_controller_1 = require("./rps.controller");
const wallets_module_1 = require("../wallets/wallets.module");
const redis_module_1 = require("../../../common/adapters/redis/redis.module");
let RpsModule = class RpsModule {
};
exports.RpsModule = RpsModule;
exports.RpsModule = RpsModule = __decorate([
    (0, common_1.Module)({
        imports: [wallets_module_1.WalletsModule, redis_module_1.RedisModule],
        controllers: [rps_controller_1.RpsController],
        providers: [rps_service_1.RpsService],
    })
], RpsModule);
//# sourceMappingURL=rps.module.js.map