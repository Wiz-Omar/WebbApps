import { User } from "../model/user";
import { Image } from "../model/image";

export interface IMappingService {
    getUser(username: string): Promise<User>;
    getImage(imageId: string): Promise<Image>;
    mapDatabaseUserToUser(databaseUser: any): User;
    mapDatabaseImageToImage(databaseImage: any): Image;
  }
  