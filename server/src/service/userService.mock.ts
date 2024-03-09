import { UserNotFoundError } from '../errors/userErrors';
import { User } from '../model/user';
import { IUserService } from './userService.interface';

export const USER: User = {
    id: '1',
    username: 'test',
    password: 'test'
};

export class MockUserService implements IUserService {
    private users: User[] = [];

    constructor() {
        this.users.push(USER);
    }

    async find(username: string, password: string): Promise<boolean> {
        const user = this.users.find(u => u.username === username && u.password === password);
        return user !== undefined;
    }

    async addUser(username: string, password: string): Promise<void> {
        const existingUser = this.users.some(u => u.username === username);
        if (!existingUser) {
            this.users.push({
                id: new Date().getTime().toString(), // Simple ID generation for mock
                username: username,
                password: password
            });
        }
    }

    async removeUser(username: string): Promise<void> {
        this.users = this.users.filter(u => u.username !== username);
    }

    async getUser(username: string): Promise<User> {
        const user = this.users.find(u => u.username === username);
        if (!user) {
            throw new UserNotFoundError(username);
        }
        return user;
    }
}
