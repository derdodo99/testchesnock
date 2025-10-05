import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class DevAuthMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    const id = Number(req.header("x-user-id") ?? 1);
    req.user = { id }; // тут будет видно в @AuthUser('id')
    next();
  }
}
