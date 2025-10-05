import { HealthCheckService } from '@nestjs/terminus';
import { EntityManager } from "@mikro-orm/postgresql";
import Redis from "ioredis";
export declare class HealthController {
    private health;
    private readonly em;
    private readonly redis;
    constructor(health: HealthCheckService, em: EntityManager, redis: Redis);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
