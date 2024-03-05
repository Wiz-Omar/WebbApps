// Assuming these interfaces are defined in the same file or imported appropriately
import { IMappingService } from "./mappingService.interface";
import { User } from "../model/user";
import { Image } from "../model/image";

// Mock implementation
export class MockMappingService implements IMappingService {
  async getUser(username: string): Promise<User> {
    // Return a mock user object
    const mockUser: User = {
      id: "mockId",
      username: "mockUsername",
      password: "mockPassword",
    };
    return mockUser;
  }

  async getImage(imageId: string): Promise<Image> {
    // Return a mock image object
    return {
      id: imageId,
      filename: "mockFilename.jpg",
      path: "mock/path/to/image.jpg",
      uploadDate: new Date(),
    };
  }

  mapDatabaseUserToUser(databaseUser: any): User {
    // Return a mock user object
    return {
      id: databaseUser._id.toString(),
      username: databaseUser.username,
      password: databaseUser.password,
    };
  }

  mapDatabaseImageToImage(databaseImage: any): Image {
    // Return a mock image object
    return {
      id: databaseImage._id.toString(),
      filename: databaseImage.filename,
      path: databaseImage.path,
      uploadDate: databaseImage.uploadDate,
    };
  }
}
