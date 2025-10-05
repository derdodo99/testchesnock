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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const postgresql_1 = require("@mikro-orm/postgresql");
const ioredis_1 = __importDefault(require("ioredis"));
let HealthController = class HealthController {
    health;
    em;
    redis;
    constructor(health, em, redis) {
        this.health = health;
        this.em = em;
        this.redis = redis;
    }
    async check() {
        return this.health.check([
            async () => {
                await this.em.getConnection().execute('SELECT 1');
                return { database: { status: 'up' } };
            },
            async () => {
                await this.redis.ping();
                return { redis: { status: 'up' } };
            },
        ]);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __param(2, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        postgresql_1.EntityManager,
        ioredis_1.default])
], HealthController);
//# sourceMappingURL=health.controller.js.map