export interface IUserService {
    find(userId: string, password: string): Promise<boolean>;
    addUser(userId: string, password: string): Promise<void>;
    removeUser(userId: string): Promise<void>;
    validateUser(userId: string, password: string): Promise<boolean>;
}