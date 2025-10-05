import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../entities/user.entity.js';
export declare class UsersRepository {
    private readonly em;
    constructor(em: EntityManager);
    findByTelegramId(telegramId: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(data: any): Promise<User>;
}
