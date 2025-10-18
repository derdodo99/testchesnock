import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UserEntity } from '@src/entities/user.entity';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';

@Injectable()
export class UsersRepository extends EntityRepository<UserEntity> {
  async findByTelegramId(telegramId: CreateUserDto['telegramId']): Promise<UserEntity | null> {
    return this.findOne({ telegramId });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.findOne({ id });
  }

  async createUser(data: CreateUserDto) {
    const user = this.create(data);
    await this.em.persistAndFlush(user);
    return user;
  }
}
