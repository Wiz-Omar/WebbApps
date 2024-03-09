import { User } from "../model/user";
import { Image } from "../model/image";

export interface IMappingService {
    mapDatabaseUserToUser(databaseUser: any): User;
    mapDatabaseImageToImage(databaseImage: any): Image;
  }
  