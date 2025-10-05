import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { User } from '../../entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.usersRepo.findByTelegramId(telegramId);
  }
  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findById(id);
  }
  async findOrCreateByTelegramId(tgUserId: number | string): Promise<User> {
    const telegramId = String(tgUserId);
    const existing = await this.usersRepo.findByTelegramId(telegramId);
    if (existing) return existing;

    return this.usersRepo.create({ telegramId, country: 'RU' });
  }
}
