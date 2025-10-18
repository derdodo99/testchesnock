import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SpinRequestDto {
  @IsString()
  poolId!: string;

  @IsOptional()
  @IsBoolean()
  demo?: boolean;

  @IsOptional()
  @IsString()
  clientSeed?: string;
}
