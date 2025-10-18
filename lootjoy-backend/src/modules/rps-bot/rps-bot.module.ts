import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { RpsBotController } from './rps-bot.controller';
import { RpsBotService } from './ps-bot.service';
import { RedisModule } from '@root/common/adapters/redis/redis.module';
import { RpsBotGameEntity } from '@src/entities/rps-bot-game.entity';
import { RpsBotMoveEntity } from '@src/entities/rps-bot-move.entity';
import { UserEntity } from '@src/entities/user.entity';

@Module({
  imports: [
    RedisModule, // глобальный, но импорт не мешает
    MikroOrmModule.forFeature([RpsBotGameEntity, RpsBotMoveEntity, UserEntity]),
  ],
  controllers: [RpsBotController],
  providers: [RpsBotService],
  exports: [RpsBotService],
})
export class RpsBotModule {}
