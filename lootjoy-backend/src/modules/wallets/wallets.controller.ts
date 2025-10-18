import { Controller, Get, Param, Post, Body, ParseIntPipe } from '@nestjs/common';
import { WalletsService } from '@src/modules/wallets/wallets.service';
import { AmountDto } from '@src/modules/wallets/dto/amount.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly wallets: WalletsService) {}

  @Get(':userId/balance')
  balance(@Param('userId', ParseIntPipe) userId: string) {
    return this.wallets.balanceByUserId(userId);
  }

  @Post(':userId/credit')
  credit(@Param('userId', ParseIntPipe) userId: string, @Body() dto: AmountDto) {
    return this.wallets.credit({
      userId,
      amount: dto.amount,
      reason: dto.reason,
      correlationId: dto.cid,
      type: dto.type,
    });
  }

  @Post(':userId/debit')
  debit(@Param('userId', ParseIntPipe) userId: string, @Body() dto: AmountDto) {
    return this.wallets.debit({
      userId,
      amount: dto.amount,
      reason: dto.reason,
      correlationId: dto.cid,
      type: dto.type,
    });
  }
}
