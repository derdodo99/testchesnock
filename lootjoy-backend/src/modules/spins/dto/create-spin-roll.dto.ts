import { SpinPoolEntity } from '@src/entities/spin-pool.entity';
import { PrizeType } from '@root/common/enums';
import { UserEntity } from '@src/entities/user.entity';

export interface CreateSpinRollDto {
  pool: SpinPoolEntity;
  user: UserEntity;
  resultType: PrizeType;
  resultCrystals?: number;
  resultItemId?: string;
  cost: number;
  demo: boolean;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  createdAt: Date;
}
