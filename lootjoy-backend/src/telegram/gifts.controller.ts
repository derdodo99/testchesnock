import { Controller, Get, Post, Body } from '@nestjs/common';
import { GiftsService } from './gifts.service';

@Controller('tg/gifts')
export class GiftsController {
  constructor(private readonly gifts: GiftsService) {}

  @Get()
  list() {
    return this.gifts.getAvailableGifts(); // повесь кэш (Redis) на 600s
  }

  @Post('send')
  send(@Body() dto: { userId?: number; chatId?: number; giftId: string; text?: string }) {
    const payload = {
      user_id: dto.userId,
      chat_id: dto.chatId,
      gift_id: dto.giftId,
      text: dto.text,
    };
    return this.gifts.sendGift(payload);
  }
}
