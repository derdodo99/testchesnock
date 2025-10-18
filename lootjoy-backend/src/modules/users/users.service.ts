import { Injectable } from '@nestjs/common';
import { CountryType } from '@src/modules/users/types';
import { UserEntity } from '@src/entities/user.entity';
import { UsersRepository } from '@src/modules/users/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByTelegramId(telegramId: string): Promise<UserEntity | null> {
    return this.usersRepository.findByTelegramId(telegramId);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findById(id);
  }

  async findOrCreateByTelegramId(tgUserId: string): Promise<UserEntity> {
    const telegramId = String(tgUserId);
    const existing = await this.usersRepository.findByTelegramId(telegramId);
    if (existing) return existing;

    return this.usersRepository.createUser({ telegramId, country: CountryType.RU });
  }
}
