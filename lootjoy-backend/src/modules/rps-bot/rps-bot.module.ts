import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { RpsBotGame } from "../../entities/rps-bot-game.entity";
import { RpsBotMove } from "../../entities/rps-bot-move.entity";
import { User } from "../../entities/user.entity";
import { RedisModule } from "../../../common/adapters/redis/redis.module";
import { RpsBotController } from "./rps-bot.controller";
import { RpsBotService } from "./ps-bot.service";

@Module({
  imports: [
    RedisModule, // глобальный, но импорт не мешает
    MikroOrmModule.forFeature([RpsBotGame, RpsBotMove, User]),
  ],
  controllers: [RpsBotController],
  providers: [RpsBotService],
  exports: [RpsBotService],
})
export class RpsBotModule {}
