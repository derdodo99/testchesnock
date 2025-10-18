import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '@src/entities/user.entity';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly em: EntityManager) {}
  async findByTelegramId(telegramId: CreateUserDto['telegramId']): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { telegramId });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { id });
  }

  async createUser(data: CreateUserDto) {
    const user = this.em.create(UserEntity, data);
    await this.em.persistAndFlush(user);
    return user;
  }
}
