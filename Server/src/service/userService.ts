import { IUserService } from "./userService.interface";
import { userModel } from "../db/users.db";
import { Model } from "mongoose";
import { User } from "../model/user";
import { ObjectId } from "mongodb";
import { UserExistsError, UserNotFoundError } from "../errors/userErrors";
import { IMappingService } from "./mappingService.interface";
import { MappingService } from "./mappingService";

export class UserService implements IUserService {
  private mappingService: IMappingService;

  constructor(mappingService: IMappingService = new MappingService()) {
    this.mappingService = mappingService;
  }
  async addUser(username: string, password: string): Promise<void> {
    const um: Model<User> = await userModel;

    if (!(await um.findOne({ username: username }))) {
      await um.create({
        username: username,
        password: password,
      });
    } else {
      throw new UserExistsError(username);
    }
  }

  async removeUser(username: string): Promise<void> {
    const um: Model<User> = await userModel;

    if (await um.findOne({ username: username })) {
      await um.deleteOne({
        username: username,
      });
    } else {
      throw new UserNotFoundError(username);
    }
  }

  async find(username: string, password: string): Promise<boolean> {
    const um: Model<User> = await userModel;
    return (await um.findOne({ username: username, password: password }))
      ? true
      : false;
  }

  async getUser(username: string): Promise<User> {
    const um: Model<User> = await userModel;
    const databaseUser = await um.findOne({ username });
    if (!databaseUser) {
      throw new UserNotFoundError(username);
    }
    return this.mappingService.mapDatabaseUserToUser(databaseUser);
  }
}
