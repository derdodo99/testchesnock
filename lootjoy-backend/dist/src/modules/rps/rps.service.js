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
exports.RpsService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const ioredis_1 = require("ioredis");
const wallets_service_1 = require("../wallets/wallets.service");
const user_entity_1 = require("../../entities/user.entity");
const rps_game_entity_1 = require("../../entities/rps-game.entity");
const enums_1 = require("../../../common/enums");
const constants_1 = require("../../../common/constants");
const rps_move_entity_1 = require("../../entities/rps-move.entity");
const utils_1 = require("../../../common/utils");
let RpsService = class RpsService {
    em;
    redis;
    wallets;
    constructor(em, redis, wallets) {
        this.em = em;
        this.redis = redis;
        this.wallets = wallets;
    }
    async joinQueue(userId, bet) {
        const key = `rps:queue:${bet}`;
        const opponentIdStr = await this.redis.lpop(key);
        if (!opponentIdStr || +opponentIdStr === userId) {
            await this.redis.rpush(key, String(userId));
            return { queued: true };
        }
        const opponentId = +opponentIdStr;
        return this.em.transactional(async (em) => {
            const gameId = crypto.randomUUID();
            await this.wallets.debit({
                userId,
                amount: bet,
                reason: constants_1.RPS_REASON.HOLD,
                correlationId: (0, constants_1.corr)(gameId, "hold", userId),
            });
            await this.wallets.debit({
                userId: opponentId,
                amount: bet,
                reason: constants_1.RPS_REASON.HOLD,
                correlationId: (0, constants_1.corr)(gameId, "hold", opponentId),
            });
            const creatorRef = em.getReference(user_entity_1.User, opponentId);
            const opponentRef = em.getReference(user_entity_1.User, userId);
            const game = em.create(rps_game_entity_1.RpsGame, {
                id: gameId,
                bet,
                status: enums_1.RpsGameStatus.WAITING,
                creator: creatorRef,
                opponent: opponentRef,
                startedAt: new Date(),
                createdAt: new Date(),
            });
            await em.persistAndFlush(game);
            await this.redis.set(`rps:deadline:${game.id}`, "1", "EX", 120);
            return { queued: false, gameId: game.id };
        });
    }
    async createPrivate(userId, opponentId, bet) {
        return this.em.transactional(async (em) => {
            const gameId = crypto.randomUUID();
            await this.wallets.debit({
                userId,
                amount: bet,
                reason: "RPS_HOLD",
                correlationId: `rps:${gameId}:hold:u${userId}`,
            });
            await this.wallets.debit({
                userId: opponentId,
                amount: bet,
                reason: "RPS_HOLD",
                correlationId: `rps:${gameId}:hold:u${opponentId}`,
            });
            const creatorRef = em.getReference(user_entity_1.User, userId);
            const opponentRef = em.getReference(user_entity_1.User, opponentId);
            const game = em.create(rps_game_entity_1.RpsGame, {
                id: gameId,
                bet,
                status: enums_1.RpsGameStatus.WAITING,
                creator: creatorRef,
                opponent: opponentRef,
                startedAt: new Date(),
                createdAt: new Date(),
            });
            await em.persistAndFlush(game);
            await this.redis.set(`rps:deadline:${game.id}`, "1", "EX", 120);
            return { gameId: game.id };
        });
    }
    async commit(userId, gameId, commitHash) {
        const game = await this.em.findOneOrFail(rps_game_entity_1.RpsGame, { id: gameId });
        const userRef = this.em.getReference(user_entity_1.User, userId);
        const exist = await this.em.findOne(rps_move_entity_1.RpsMove, { game, user: userRef });
        if (exist?.commitHash)
            return { ok: true };
        const move = this.em.create(rps_move_entity_1.RpsMove, {
            id: crypto.randomUUID(),
            game,
            user: userRef,
            commitHash,
            committedAt: new Date(),
        });
        await this.em.persistAndFlush(move);
        const count = await this.em.count(rps_move_entity_1.RpsMove, { game });
        if (count >= 2 && game.status !== enums_1.RpsGameStatus.PLAYING) {
            (0, core_1.wrap)(game).assign({ status: enums_1.RpsGameStatus.PLAYING });
            await this.em.flush();
        }
        return { ok: true };
    }
    async reveal(userId, gameId, symbol, nonce) {
        const game = await this.em.findOneOrFail(rps_game_entity_1.RpsGame, { id: gameId }, { populate: ["moves"] });
        const userRef = this.em.getReference(user_entity_1.User, userId);
        const move = await this.em.findOneOrFail(rps_move_entity_1.RpsMove, { game, user: userRef });
        if (move.revealedAt)
            return { ok: true };
        const check = await (0, utils_1.sha256)(`${symbol}:${nonce}`);
        if (check !== move.commitHash)
            throw new Error("Commit mismatch");
        move.symbol = symbol;
        move.nonce = nonce;
        move.revealedAt = new Date();
        await this.em.flush();
        const moves = await this.em.find(rps_move_entity_1.RpsMove, { game });
        if (moves.every((m) => m.revealedAt)) {
            await this.settle(game, moves);
        }
        return { ok: true };
    }
    async state(gameId) {
        const game = await this.em.findOneOrFail(rps_game_entity_1.RpsGame, { id: gameId }, { populate: ["creator", "opponent", "winner", "moves"] });
        return {
            id: game.id,
            bet: game.bet,
            status: game.status,
            players: {
                creatorId: game.creator.id,
                opponentId: game.opponent?.id ?? null,
                winnerId: game.winner?.id ?? null,
            },
            moves: game.moves.getItems().map((m) => ({
                userId: m.user.id,
                committed: true,
                revealed: !!m.revealedAt,
            })),
            createdAt: game.createdAt,
            startedAt: game.startedAt,
            finishedAt: game.finishedAt,
        };
    }
    async settle(game, moves) {
        const [a, b] = moves;
        const res = (0, utils_1.judge)(a.symbol, b.symbol);
        await this.em.transactional(async (em) => {
            if (res === 0) {
                await this.wallets.credit({
                    userId: a.user.id,
                    amount: game.bet,
                    reason: constants_1.RPS_REASON.REFUND,
                    correlationId: (0, constants_1.corr)(game.id, "refund", a.user.id),
                });
                await this.wallets.credit({
                    userId: b.user.id,
                    amount: game.bet,
                    reason: constants_1.RPS_REASON.REFUND,
                    correlationId: (0, constants_1.corr)(game.id, "refund", b.user.id),
                });
            }
            else {
                const winnerId = res > 0 ? a.user.id : b.user.id;
                const payout = game.bet * 2;
                await this.wallets.credit({
                    userId: winnerId,
                    amount: payout,
                    reason: constants_1.RPS_REASON.WIN,
                    correlationId: (0, constants_1.corr)(game.id, "win", winnerId),
                });
                game.winner = em.getReference(user_entity_1.User, winnerId);
            }
            game.status = enums_1.RpsGameStatus.FINISHED;
            game.finishedAt = new Date();
            await em.flush();
            await this.redis.del(`rps:deadline:${game.id}`);
        });
    }
};
exports.RpsService = RpsService;
exports.RpsService = RpsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)("REDIS")),
    __metadata("design:paramtypes", [core_1.EntityManager,
        ioredis_1.Redis,
        wallets_service_1.WalletsService])
], RpsService);
//# sourceMappingURL=rps.service.js.map