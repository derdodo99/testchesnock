import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { CountryType } from '@src/modules/users/types';

@Entity({ tableName: 'users' })
export class UserEntity {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property({ unique: true })
  telegramId!: string;

  @Property({ nullable: true })
  username?: string;

  @Enum(() => CountryType)
  country!: CountryType;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
