import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { imageModel } from "../db/image.db";
import { userModel } from "../db/users.db";
import { User } from "../model/user";
import { IUserService } from "./userService.interface";
import { Image } from "../model/image";
import { IMappingService } from "./mappingService.interface";
import { UserNotFoundError } from "../errors/userErrors";
import { ImageNotFoundError } from "../errors/imageErrors";

export class MappingService {

  static mapDatabaseUserToUser(databaseUser: DatabaseUser): User {
    return {
      id: databaseUser._id.toString(),
      username: databaseUser.username,
      password: databaseUser.password,
    };
  }

  static mapDatabaseImageToImage(databaseImage: DatabaseImage): Image {
    return {
      id: databaseImage._id.toString(),
      filename: databaseImage.filename,
      path: databaseImage.path,
      uploadDate: databaseImage.uploadDate,
    };
  }
}


//TOOD: move to separate files
export interface DatabaseUser {
  _id: ObjectId;
  username: string;
  password: string;
}

export interface DatabaseImage {
  _id: ObjectId;
  filename: string;
  path: string;
  uploadDate: Date;
}