import { Module } from '@nestjs/common';
import { UsersModule } from '@src/modules/users/users.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SpinPoolEntity } from '@src/entities/spin-pool.entity';
import { SpinItemEntity } from '@src/entities/spin-item.entity';
import { SpinRollEntity } from '@src/entities/spin-roll.entity';
import { InventoryItemEntity } from '@src/entities/inventory-item.entity';
import { SpinsController } from '@src/modules/spins/spins.controller';
import { SpinsService } from '@src/modules/spins/spins-service';
import { SpinsRepository } from '@src/modules/spins/spins.repository';

@Module({
  imports: [
    UsersModule,
    MikroOrmModule.forFeature([
      SpinPoolEntity,
      SpinItemEntity,
      SpinRollEntity,
      InventoryItemEntity,
    ]),
  ],
  controllers: [SpinsController],
  providers: [SpinsService, SpinsRepository],
  exports: [SpinsService],
})
export class SpinsModule {}
