import { RpsService } from "./rps.service";
import { CommitDto, CreatePrivateDto, QueueDto, RevealDto, StateParams } from "../../../common/dto";
export declare class RpsController {
    private readonly service;
    constructor(service: RpsService);
    join(userId: number, dto: QueueDto): Promise<{
        queued: boolean;
        gameId: string;
    } | {
        queued: boolean;
    }>;
    createPrivate(userId: number, dto: CreatePrivateDto): Promise<{
        gameId: string;
    }>;
    commit(userId: number, dto: CommitDto): Promise<{
        ok: boolean;
    }>;
    reveal(userId: number, dto: RevealDto): Promise<{
        ok: boolean;
    }>;
    state(p: StateParams): void;
}
