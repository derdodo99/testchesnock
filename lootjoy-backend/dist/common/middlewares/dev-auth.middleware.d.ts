import { NestMiddleware } from "@nestjs/common";
export declare class DevAuthMiddleware implements NestMiddleware {
    use(req: any, _res: any, next: () => void): void;
}
