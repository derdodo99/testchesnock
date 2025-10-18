import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { UsersService } from '@src/modules/users/users.service';
import { SpinsService } from '@src/modules/spins/spins-service';
import { SpinRequestDto } from '@src/modules/spins/dto/request/spin.request.dto';

@Controller('spins')
export class SpinsController {
  constructor(
    private readonly spins: SpinsService,
    private readonly users: UsersService,
  ) {}

  @Get('spin-pools')
  async listPools() {
    return this.spins.listPools();
  }

  @Post()
  async spin(
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: SpinRequestDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.id ?? userIdHeader;
    if (!userId) throw new Error('Missing user id');

    const user = await this.users.findById(userId);
    if (!user) throw new Error('User not found');

    return this.spins.spin(user, body.poolId, !!body.demo, body.clientSeed);
  }
}
