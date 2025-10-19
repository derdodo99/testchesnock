import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { verifyTelegramInitData } from './telegram-verify';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';

@Controller('auth/miniapp')
export class AuthController {
  private token: string = process.env.TELEGRAM_BOT_TOKEN!;

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  @Post('login')
  async login(@Body() dto: { initData: string }, @Res() res: Response) {
    const verify = verifyTelegramInitData(this.token, dto.initData);
    if (!verify.ok) throw new UnauthorizedException(verify.reason);

    const rawUser = new URLSearchParams(dto.initData).get('user');
    const tgUser = rawUser ? JSON.parse(rawUser) : null;

    if (!tgUser?.id) throw new UnauthorizedException('no_user');

    const user = await this.users.findOrCreateByTelegramId(tgUser);
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      tgId: tgUser.id,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // важно для Telegram WebView
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
    });

    return res.json({ user: { id: user.id, tgId: tgUser.id, username: tgUser.username } });
  }
}
