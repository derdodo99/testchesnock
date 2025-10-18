import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CountryType } from '@src/modules/users/types';

export class CreateUserDto {
  @IsString()
  telegramId!: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsEnum(CountryType)
  country!: CountryType;
}
