import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { imageModel } from "../db/image.db";
import { userModel } from "../db/users.db";
import { User } from "../model/user";
import { IUserService } from "./userService.interface";
import { Image } from "../model/image";
import { IMappingService } from "./mappingService.interface";

export class MappingService implements IMappingService {
  async getUser(username: string): Promise<User> {
    const um: Model<User> = await userModel;
    const databaseUser = await um.findOne({ username: username });
    if (databaseUser === null) {
      throw new UserNotFoundError(username);
    }
    return this.mapDatabaseUserToUser(databaseUser);
  }
  //TODO: where is this supposed to be used? not used right now. This kind of functionality is in the databaseImageService right now.
  async getImage(imageId: string): Promise<Image> {
    const im: Model<Image> = await imageModel;
    const databaseImage = await im.findOne({ _id: new ObjectId(imageId) }); //imageId need to be valid according to mongodb.
    if (databaseImage === null) {
      throw new Error("Image not found");
    }
    return this.mapDatabaseImageToImage(databaseImage);
  }

  mapDatabaseUserToUser(databaseUser: DatabaseUser): User {
    return {
      id: databaseUser._id.toString(),
      username: databaseUser.username,
      password: databaseUser.password,
    };
  }

  mapDatabaseImageToImage(databaseImage: DatabaseImage): Image {
    return {
      id: databaseImage._id.toString(),
      filename: databaseImage.filename,
      path: databaseImage.path,
      uploadDate: databaseImage.uploadDate,
    };
  }
}

interface DatabaseUser {
  _id: ObjectId;
  username: string;
  password: string;
}

interface DatabaseImage {
  _id: ObjectId;
  filename: string;
  path: string;
  uploadDate: Date;
}

export class UserNotFoundError extends Error {
  constructor(username: string) {
    super("User not found: " + username);
  }
}