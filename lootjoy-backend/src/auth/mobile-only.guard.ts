import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class MobileOnlyGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const ua = String(req.headers['user-agent'] || '');
    const isTelegram = /Telegram/i.test(ua);
    const isMobile = /(Android|iPhone|iPad|iOS)/i.test(ua);

    if (!(isTelegram && isMobile)) {
      throw new ForbiddenException('Only Telegram mobile app is allowed');
    }

    return true;
  }
}
