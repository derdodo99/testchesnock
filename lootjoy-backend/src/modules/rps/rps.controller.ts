import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RpsService } from './rps.service';
import { CommitDto, CreatePrivateDto, QueueDto, RevealDto, StateParams } from '@root/common/dto';
import { AuthUser } from '@src/auth/decorators/auth-user.decorator';

@Controller('rps')
export class RpsController {
  constructor(private readonly service: RpsService) {}

  @Post('queue')
  join(@AuthUser('id') userId: number, @Body() dto: QueueDto) {
    return this.service.joinQueue(userId, dto.bet);
  }

  @Post('duel')
  createPrivate(@AuthUser('id') userId: number, @Body() dto: CreatePrivateDto) {
    return this.service.createPrivate(userId, dto.opponentId, dto.bet);
  }

  @Post('commit')
  commit(@AuthUser('id') userId: number, @Body() dto: CommitDto) {
    return this.service.commit(userId, dto.gameId, dto.commitHash);
  }

  @Post('reveal')
  reveal(@AuthUser('id') userId: number, @Body() dto: RevealDto) {
    return this.service.reveal(userId, dto.gameId, dto.symbol, dto.nonce);
  }

  @Get('state/:gameId')
  state(@Param() p: StateParams) {
    // можно вернуть минимальный срез: статус игры, кто соперник, сделал ли он commit/reveal и т.п.
    // для простоты — пусть фронт запрашивает /state, а оповещения дадим через WS
  }
}
