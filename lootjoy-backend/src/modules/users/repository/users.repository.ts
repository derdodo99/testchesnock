import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '@src/entities/user.entity';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly em: EntityManager) {}

  findByTelegramId(telegramId: CreateUserDto['telegramId']): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { telegramId });
  }
  findById(id: number): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { id });
  }
  async create(data: CreateUserDto) {
    return this.em.create(UserEntity, data);
  }
}
