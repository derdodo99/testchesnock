import { UsersRepository } from './repository/users.repository';
import { User } from '../../entities/user.entity.js';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: UsersRepository);
    findByTelegramId(telegramId: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    findOrCreateByTelegramId(tgUserId: number | string): Promise<User>;
}
