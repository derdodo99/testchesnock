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
exports.RpsBotService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const rps_bot_game_entity_1 = require("../../entities/rps-bot-game.entity");
const rps_bot_move_entity_1 = require("../../entities/rps-bot-move.entity");
const user_entity_1 = require("../../entities/user.entity");
const constants_1 = require("../../../common/constants");
const enums_1 = require("../../../common/enums");
const utils_1 = require("../../../common/utils");
const deadlineKey = (gameId) => `rpsbot:deadline:${gameId}`;
let RpsBotService = class RpsBotService {
    em;
    redis;
    constructor(em, redis) {
        this.em = em;
        this.redis = redis;
    }
    async start(userId = 1) {
        return this.em.transactional(async (em) => {
            const gameId = crypto.randomUUID();
            const playerRef = em.getReference(user_entity_1.User, userId);
            console.log(playerRef, "playerRef");
            const botRef = em.getReference(user_entity_1.User, constants_1.BOT_ID);
            console.log(botRef, "botRef");
            const game = em.create(rps_bot_game_entity_1.RpsBotGame, {
                id: gameId,
                bet: 0,
                status: enums_1.RpsGameStatus.WAITING,
                player: playerRef,
                botWon: false,
                winner: null,
                startedAt: new Date(),
                createdAt: new Date(),
            });
            console.log(game, 'gamegame');
            await em.persistAndFlush(game);
            await this.redis.set(deadlineKey(gameId), "1", "EX", 120);
            const botSymbol = this.pick();
            const botNonce = crypto.randomUUID();
            const botHash = await (0, utils_1.sha256)(`${botSymbol}:${botNonce}`);
            const botMove = em.create(rps_bot_move_entity_1.RpsBotMove, {
                id: crypto.randomUUID(),
                game,
                user: botRef,
                commitHash: botHash,
                symbol: botSymbol,
                nonce: botNonce,
                committedAt: new Date(),
                revealedAt: new Date(),
            });
            await em.persistAndFlush(botMove);
            return { gameId };
        });
    }
    async commit(userId, gameId, commitHash) {
        const game = await this.em.findOneOrFail(rps_bot_game_entity_1.RpsBotGame, { id: gameId });
        const userRef = this.em.getReference(user_entity_1.User, userId);
        const exist = await this.em.findOne(rps_bot_move_entity_1.RpsBotMove, { game, user: userRef });
        if (exist?.commitHash)
            return { ok: true };
        const move = this.em.create(rps_bot_move_entity_1.RpsBotMove, {
            id: crypto.randomUUID(),
            game,
            user: userRef,
            commitHash,
            committedAt: new Date(),
        });
        await this.em.persistAndFlush(move);
        const count = await this.em.count(rps_bot_move_entity_1.RpsBotMove, { game });
        if (count >= 2 && game.status !== enums_1.RpsGameStatus.PLAYING) {
            game.status = enums_1.RpsGameStatus.PLAYING;
            await this.em.flush();
        }
        return { ok: true };
    }
    async reveal(userId, gameId, symbol, nonce) {
        const game = await this.em.findOneOrFail(rps_bot_game_entity_1.RpsBotGame, { id: gameId }, { populate: ["moves"] });
        const userRef = this.em.getReference(user_entity_1.User, userId);
        const move = await this.em.findOneOrFail(rps_bot_move_entity_1.RpsBotMove, {
            game,
            user: userRef,
        });
        if (move.revealedAt)
            return { ok: true };
        const check = await (0, utils_1.sha256)(`${symbol}:${nonce}`);
        if (check !== move.commitHash)
            throw new Error("Commit mismatch");
        move.symbol = symbol;
        move.nonce = nonce;
        move.revealedAt = new Date();
        await this.em.flush();
        const moves = await this.em.find(rps_bot_move_entity_1.RpsBotMove, { game });
        if (moves.every((m) => m.revealedAt)) {
            await this.settle(game, moves);
        }
        return { ok: true };
    }
    async state(gameId) {
        const game = await this.em.findOneOrFail(rps_bot_game_entity_1.RpsBotGame, { id: gameId }, { populate: ["player", "winner", "moves"] });
        return {
            id: game.id,
            bet: game.bet,
            status: game.status,
            botWon: game.botWon,
            players: {
                playerId: game.player.id,
                botId: constants_1.BOT_ID,
                winnerId: game.winner?.id ?? (game.botWon ? constants_1.BOT_ID : null),
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
        const playerMove = moves.find((m) => m.user.id !== constants_1.BOT_ID);
        const botMove = moves.find((m) => m.user.id === constants_1.BOT_ID);
        const res = (0, utils_1.judge)(playerMove.symbol, botMove.symbol);
        if (res === 0) {
            game.winner = null;
            game.botWon = false;
        }
        else if (res > 0) {
            game.winner = this.em.getReference(user_entity_1.User, playerMove.user.id);
            game.botWon = false;
        }
        else {
            game.winner = null;
            game.botWon = true;
        }
        game.status = enums_1.RpsGameStatus.FINISHED;
        game.finishedAt = new Date();
        await this.em.flush();
        await this.redis.del(deadlineKey(game.id));
    }
    pick() {
        const arr = ["rock", "paper", "scissors"];
        return arr[Math.floor(Math.random() * arr.length)];
    }
};
exports.RpsBotService = RpsBotService;
exports.RpsBotService = RpsBotService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)("REDIS")),
    __metadata("design:paramtypes", [core_1.EntityManager, Function])
], RpsBotService);
//# sourceMappingURL=ps-bot.service.js.map