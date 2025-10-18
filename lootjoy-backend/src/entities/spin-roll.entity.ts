import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { SpinPoolEntity } from '@src/entities/spin-pool.entity';
import { PrizeType } from '@root/common/enums';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ tableName: 'spin_rolls' })
export class SpinRollEntity {
  @PrimaryKey() id: string = crypto.randomUUID();
  @ManyToOne(() => SpinPoolEntity) pool!: SpinPoolEntity;
  @ManyToOne(() => UserEntity) user!: UserEntity;
  @Enum(() => PrizeType) resultType!: PrizeType;
  @Property({ nullable: true }) resultCrystals?: number;
  @Property({ nullable: true }) resultItemId?: string;
  @Property() cost!: number;
  @Property({ default: false }) demo!: boolean;
  @Property() serverSeedHash!: string;
  @Property() clientSeed!: string;
  @Property() nonce!: number;
  @Property({ onCreate: () => new Date() }) createdAt = new Date();
}
