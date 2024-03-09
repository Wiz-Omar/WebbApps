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

//TODO: Make methods static? No need to create an instance of this class then.
export class MappingService implements IMappingService {

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

//TOOD: move to separate files
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