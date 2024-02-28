import { IUserService } from "./userService.interface";
import {userModel} from "../db/users.db";
import { Model } from "mongoose";
import { User } from "../model/user";


export class UserService implements IUserService{

    constructor() {
    }
    async addUser(userId: string, password: string): Promise<void> {
        const um: Model<User> = await userModel;

        if (!(await um.findOne({username: userId}))) {
            um.create({
                username: userId, 
                password: password
            });
        } else {
            throw new UserExistsError(userId);
        }
    }
    async removeUser(userId: string): Promise<void> {
        const um: Model<User> = await userModel;

        if (await um.findOne({username: userId})) {
            um.deleteOne({
                username: userId, 
            });
        } else {
            throw new UserNotFoundError(userId);
        }
    }
    async find(userId: string, password: string): Promise<boolean> {
        const um: Model<User> = await userModel;

        return await um.findOne({username: userId, password: password}) ? true : false;
    }
    async validateUser(userId: string, password: string): Promise<boolean> {
        const um: Model<User> = await userModel;

        return await um.findOne({username: userId, password: password}) ? true : false;
    }
}

class UserNotFoundError extends Error {
    constructor(userId: string) {
      super(`User with id ${userId} not found`);
      this.name = "UserNotFoundError";
    }
}

class UserExistsError extends Error {
    constructor(userId: string) {
      super(`User with id ${userId} already exists`);
      this.name = "UserExistsError";
    }
}