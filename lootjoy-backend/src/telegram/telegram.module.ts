import { GiftsController } from '@src/telegram/gifts.controller';
import { GiftsService } from '@src/telegram/gifts.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService],
})
export class TelegramModule {}
