import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, wrap } from '@mikro-orm/core';
import { Redis } from 'ioredis';
import { WalletsService } from '@src/modules/wallets/wallets.service';
import { corr, RPS_REASON } from '@root/common/constants';
import { UserEntity } from '@src/entities/user.entity';
import { RpsGameEntity } from '@src/entities/rps-game.entity';
import { RpsGameStatus } from '@root/common/enums';
import { RpsMoveEntity } from '@src/entities/rps-move.entity';
import { RpsSymbol } from '@root/common/types';
import { judge, sha256 } from '@root/common/utils';

@Injectable()
export class RpsService {
  constructor(
    private readonly em: EntityManager,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly wallets: WalletsService,
  ) {}

  async joinQueue(userId: string, bet: number) {
    const key = `rps:queue:${bet}`;
    const opponentIdStr = await this.redis.lpop(key);

    if (!opponentIdStr || opponentIdStr === userId) {
      await this.redis.rpush(key, String(userId));
      return { queued: true };
    }

    const opponentId = opponentIdStr;

    return this.em.transactional(async (em) => {
      const gameId = crypto.randomUUID();

      await this.wallets.debit({
        userId,
        amount: bet,
        reason: RPS_REASON.HOLD,
        correlationId: corr(gameId, 'hold', userId),
      });
      await this.wallets.debit({
        userId: opponentId,
        amount: bet,
        reason: RPS_REASON.HOLD,
        correlationId: corr(gameId, 'hold', opponentId),
      });

      const creatorRef = em.getReference(UserEntity, opponentId);
      const opponentRef = em.getReference(UserEntity, userId);

      const game = em.create(RpsGameEntity, {
        id: gameId,
        bet,
        status: RpsGameStatus.WAITING,
        creator: creatorRef,
        opponent: opponentRef,
        startedAt: new Date(),
        createdAt: new Date(),
      });
      await em.persistAndFlush(game);

      await this.redis.set(`rps:deadline:${game.id}`, '1', 'EX', 120);

      return { queued: false, gameId: game.id };
    });
  }
  async createPrivate(userId: string, opponentId: string, bet: number) {
    return this.em.transactional(async (em) => {
      const gameId = crypto.randomUUID();

      await this.wallets.debit({
        userId,
        amount: bet,
        reason: 'RPS_HOLD',
        correlationId: `rps:${gameId}:hold:u${userId}`,
      });
      await this.wallets.debit({
        userId: opponentId,
        amount: bet,
        reason: 'RPS_HOLD',
        correlationId: `rps:${gameId}:hold:u${opponentId}`,
      });

      const creatorRef = em.getReference(UserEntity, userId);
      const opponentRef = em.getReference(UserEntity, opponentId);

      const game = em.create(RpsGameEntity, {
        id: gameId,
        bet,
        status: RpsGameStatus.WAITING,
        creator: creatorRef,
        opponent: opponentRef,
        startedAt: new Date(),
        createdAt: new Date(),
      });
      await em.persistAndFlush(game);

      await this.redis.set(`rps:deadline:${game.id}`, '1', 'EX', 120);

      return { gameId: game.id };
    });
  }

  async commit(userId: string, gameId: string, commitHash: string) {
    const game = await this.em.findOneOrFail(RpsGameEntity, { id: gameId });
    const userRef = this.em.getReference(UserEntity, userId);

    const exist = await this.em.findOne(RpsMoveEntity, { game, user: userRef });
    if (exist?.commitHash) return { ok: true };

    const move = this.em.create(RpsMoveEntity, {
      id: crypto.randomUUID(),
      game,
      user: userRef,
      commitHash,
      committedAt: new Date(),
    });
    await this.em.persistAndFlush(move);

    const count = await this.em.count(RpsMoveEntity, { game });
    if (count >= 2 && game.status !== RpsGameStatus.PLAYING) {
      wrap(game).assign({ status: RpsGameStatus.PLAYING });
      await this.em.flush();
    }
    return { ok: true };
  }

  async reveal(userId: string, gameId: string, symbol: RpsSymbol, nonce: string) {
    const game = await this.em.findOneOrFail(
      RpsGameEntity,
      { id: gameId },
      { populate: ['moves'] },
    );
    const userRef = this.em.getReference(UserEntity, userId);
    const move = await this.em.findOneOrFail(RpsMoveEntity, { game, user: userRef });

    if (move.revealedAt) return { ok: true };

    const check = await sha256(`${symbol}:${nonce}`);
    if (check !== move.commitHash) throw new Error('Commit mismatch');

    move.symbol = symbol;
    move.nonce = nonce;
    move.revealedAt = new Date();
    await this.em.flush();

    const moves = await this.em.find(RpsMoveEntity, { game });
    if (moves.every((m) => m.revealedAt)) {
      await this.settle(game, moves);
    }
    return { ok: true };
  }

  async state(gameId: string) {
    const game = await this.em.findOneOrFail(
      RpsGameEntity,
      { id: gameId },
      { populate: ['creator', 'opponent', 'winner', 'moves'] },
    );
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

  private async settle(game: RpsGameEntity, moves: RpsMoveEntity[]) {
    const [a, b] = moves;
    const res = judge(a.symbol!, b.symbol!); // -1 a проиграл, 0 ничья, 1 a выиграл

    await this.em.transactional(async (em) => {
      if (res === 0) {
        await this.wallets.credit({
          userId: a.user.id,
          amount: game.bet,
          reason: RPS_REASON.REFUND,
          correlationId: corr(game.id, 'refund', a.user.id),
        });
        await this.wallets.credit({
          userId: b.user.id,
          amount: game.bet,
          reason: RPS_REASON.REFUND,
          correlationId: corr(game.id, 'refund', b.user.id),
        });
      } else {
        const winnerId = res > 0 ? a.user.id : b.user.id;
        const payout = game.bet * 2;

        await this.wallets.credit({
          userId: winnerId,
          amount: payout,
          reason: RPS_REASON.WIN,
          correlationId: corr(game.id, 'win', winnerId),
        });

        game.winner = em.getReference(UserEntity, winnerId);
      }

      game.status = RpsGameStatus.FINISHED;
      game.finishedAt = new Date();
      await em.flush();
      await this.redis.del(`rps:deadline:${game.id}`);
    });
  }
}
