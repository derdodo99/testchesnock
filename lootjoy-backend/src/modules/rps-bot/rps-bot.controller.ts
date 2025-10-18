import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthUser } from '@src/auth/decorators/auth-user.decorator';
import { RpsBotService } from './ps-bot.service';

@Controller('rps-bot')
export class RpsBotController {
  constructor(private readonly service: RpsBotService) {}

  @Post('start')
  start(@AuthUser('id') userId: string) {
    return this.service.start(userId);
  }

  @Post('commit')
  commit(@AuthUser('id') userId: string, @Body() body: { gameId: string; commitHash: string }) {
    return this.service.commit(userId, body.gameId, body.commitHash);
  }

  @Post('reveal')
  reveal(
    @AuthUser('id') userId: string,
    @Body()
    body: {
      gameId: string;
      symbol: 'rock' | 'paper' | 'scissors';
      nonce: string;
    },
  ) {
    return this.service.reveal(userId, body.gameId, body.symbol, body.nonce);
  }

  @Get('state/:id')
  state(@Param('id') gameId: string) {
    return this.service.state(gameId);
  }
}
