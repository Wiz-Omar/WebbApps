import { User } from "../model/user";

export interface IUserService {
    find(username: string, password: string): Promise<boolean>;
    addUser(username: string, password: string): Promise<void>;
    removeUser(username: string): Promise<void>;
    validateUser(username: string, password: string): Promise<boolean>;
}