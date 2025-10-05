import { Module } from '@nestjs/common';
import { RpsService } from './rps.service';
import { RpsController } from './rps.controller';
import { WalletsModule } from '../wallets/wallets.module';
import { RedisModule } from '../../../common/adapters/redis/redis.module';

@Module({
  imports: [WalletsModule, RedisModule],
  controllers: [RpsController],
  providers: [RpsService /*, RpsGateway */],
})
export class RpsModule {}
