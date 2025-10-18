import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import type Redis from 'ioredis';
import { UserEntity } from '@src/entities/user.entity';
import { BOT_ID } from '@root/common/constants';
import { RpsBotGameEntity } from '@src/entities/rps-bot-game.entity';
import { RpsGameStatus } from '@root/common/enums';
import { RpsSymbol } from '@root/common/types';
import { judge, sha256 } from '@root/common/utils';
import { RpsBotMoveEntity } from '@src/entities/rps-bot-move.entity';

// ключ TTL в redis
const deadlineKey = (gameId: string) => `rpsbot:deadline:${gameId}`;

@Injectable()
export class RpsBotService {
  constructor(
    private readonly em: EntityManager,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  // создать бесплатную игру с ботом
  async start(userId: number = 1) {
    return this.em.transactional(async (em) => {
      const gameId = crypto.randomUUID();

      const playerRef = em.getReference(UserEntity, userId);
      const botRef = em.getReference(UserEntity, BOT_ID);

      const game = em.create(RpsBotGameEntity, {
        id: gameId,
        bet: 0,
        status: RpsGameStatus.WAITING,
        player: playerRef,
        botWon: false,
        winner: null,
        startedAt: new Date(),
        createdAt: new Date(),
      });
      await em.persistAndFlush(game);

      // дедлайн партии
      await this.redis.set(deadlineKey(gameId), '1', 'EX', 120);

      // бот делает commit + reveal сразу (символ наружу не светим)
      const botSymbol: RpsSymbol = this.pick();
      const botNonce = crypto.randomUUID();
      const botHash = await sha256(`${botSymbol}:${botNonce}`);

      const botMove = em.create(RpsBotMoveEntity, {
        id: crypto.randomUUID(),
        game,
        user: botRef, // FK на users (BOT_ID)
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

  async commit(userId: number, gameId: string, commitHash: string) {
    const game = await this.em.findOneOrFail(RpsBotGameEntity, { id: gameId });

    // idempotency: один ход на пользователя
    const userRef = this.em.getReference(UserEntity, userId);
    const exist = await this.em.findOne(RpsBotMoveEntity, { game, user: userRef });
    if (exist?.commitHash) return { ok: true };

    const move = this.em.create(RpsBotMoveEntity, {
      id: crypto.randomUUID(),
      game,
      user: userRef,
      commitHash,
      committedAt: new Date(),
    });
    await this.em.persistAndFlush(move);

    // как только оба закоммитили — ставим PLAYING
    const count = await this.em.count(RpsBotMoveEntity, { game });
    if (count >= 2 && game.status !== RpsGameStatus.PLAYING) {
      game.status = RpsGameStatus.PLAYING;
      await this.em.flush();
    }
    return { ok: true };
  }

  // reveal игрока
  async reveal(userId: number, gameId: string, symbol: RpsSymbol, nonce: string) {
    const game = await this.em.findOneOrFail(
      RpsBotGameEntity,
      { id: gameId },
      { populate: ['moves'] },
    );

    const userRef = this.em.getReference(UserEntity, userId);
    const move = await this.em.findOneOrFail(RpsBotMoveEntity, {
      game,
      user: userRef,
    });

    if (move.revealedAt) return { ok: true };

    const check = await sha256(`${symbol}:${nonce}`);
    if (check !== move.commitHash) throw new Error('Commit mismatch');

    move.symbol = symbol;
    move.nonce = nonce;
    move.revealedAt = new Date();
    await this.em.flush();

    const moves = await this.em.find(RpsBotMoveEntity, { game });
    if (moves.every((m) => m.revealedAt)) {
      await this.settle(game, moves);
    }
    return { ok: true };
  }

  // состояние игры
  async state(gameId: string) {
    const game = await this.em.findOneOrFail(
      RpsBotGameEntity,
      { id: gameId },
      { populate: ['player', 'winner', 'moves'] },
    );

    return {
      id: game.id,
      bet: game.bet, // 0
      status: game.status,
      botWon: game.botWon,
      players: {
        playerId: game.player.id,
        botId: BOT_ID,
        winnerId: game.winner?.id ?? (game.botWon ? BOT_ID : null),
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

  // ====== helpers ======

  private async settle(game: RpsBotGameEntity, moves: RpsBotMoveEntity[]) {
    // найдём кто есть кто (человек vs бот)
    const playerMove = moves.find((m) => m.user.id !== BOT_ID)!;
    const botMove = moves.find((m) => m.user.id === BOT_ID)!;

    const res = judge(playerMove.symbol!, botMove.symbol!); // 1 — игрок выиграл, 0 — ничья, -1 — бот выиграл

    if (res === 0) {
      game.winner = null;
      game.botWon = false;
    } else if (res > 0) {
      game.winner = this.em.getReference(UserEntity, playerMove.user.id);
      game.botWon = false;
    } else {
      game.winner = null; // победитель — бот
      game.botWon = true;
    }

    game.status = RpsGameStatus.FINISHED;
    game.finishedAt = new Date();
    await this.em.flush();
    await this.redis.del(deadlineKey(game.id));
  }

  private pick(): RpsSymbol {
    const arr: RpsSymbol[] = ['rock', 'paper', 'scissors'];
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
