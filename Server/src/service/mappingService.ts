import { ObjectId } from "mongodb";
import { User } from "../model/user";
import { Image } from "../model/image";
import { DatabaseUser } from "../model/databaseUser";
import { DatabaseImage } from "../model/databaseImage";

/**
 * MappingService thath maps between the database and the application models
 * 
 */
export class MappingService {

  /**
   * Maps a User to a DatabaseUser
   * @param databaseUser The DatabaseUser to map
   * @returns The mapped User
   */
  static mapDatabaseUserToUser(databaseUser: DatabaseUser): User {
    return {
      id: databaseUser._id.toString(),
      username: databaseUser.username,
      password: databaseUser.password,
    };
  }

  /**
   * Maps a DatabaseImage to an Image
   * @param databaseImage The DatabaseImage to map
   * @returns The mapped Image
   */
  static mapDatabaseImageToImage(databaseImage: DatabaseImage): Image {
    return {
      id: databaseImage._id.toString(),
      filename: databaseImage.filename,
      path: databaseImage.path,
      uploadDate: databaseImage.uploadDate,
    };
  }
}
