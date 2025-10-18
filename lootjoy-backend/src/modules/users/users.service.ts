import { Injectable } from '@nestjs/common';
import { CountryType } from '@src/modules/users/types';
import { UserEntity } from '@src/entities/user.entity';
import { UsersRepository } from '@src/modules/users/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async findByTelegramId(telegramId: string): Promise<UserEntity | null> {
    return this.usersRepo.findByTelegramId(telegramId);
  }
  async findById(id: number): Promise<UserEntity | null> {
    return this.usersRepo.findById(id);
  }
  async findOrCreateByTelegramId(tgUserId: number | string): Promise<UserEntity> {
    const telegramId = String(tgUserId);
    const existing = await this.usersRepo.findByTelegramId(telegramId);
    if (existing) return existing;

    return this.usersRepo.create({ telegramId, country: CountryType.RU });
  }
}
