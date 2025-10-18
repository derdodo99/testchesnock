import { Module } from '@nestjs/common';
import { UsersService } from '@src/modules/users/users.service';
import { UsersRepository } from '@src/modules/users/repository/users.repository';

@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
