import { IUserService } from "./userService.interface";
import {userModel} from "../db/users.db";
import { Model } from "mongoose";
import { User } from "../model/user";
import { ObjectId } from "mongodb";
import { UserExistsError, UserNotFoundError } from "../errors/userErrors";

export class UserService implements IUserService{

    constructor() {
    }
    async addUser(username: string, password: string): Promise<void> {
        const um: Model<User> = await userModel;

        if (!(await um.findOne({username: username}))) {
            await um.create({
                username: username, 
                password: password
            });
        } else {
            throw new UserExistsError(username);
        }
    }

    async removeUser(username: string): Promise<void> {
        const um: Model<User> = await userModel;

        if (await um.findOne({username: username})) {
            await um.deleteOne({
                username: username, 
            });
        } else {
            throw new UserNotFoundError(username);
        }
    }

    async find(username: string, password: string): Promise<boolean> {
        const um: Model<User> = await userModel;
        return await um.findOne({username: username, password: password}) ? true : false;
    }
}

