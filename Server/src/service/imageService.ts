import { Image } from "../model/image";
import { LikeService } from "./likeService";
import { IImageService } from "./imageService.interface";
import { User } from "../model/user";
import { MappingService } from "./mappingService";
import { IPathService } from "./pathService.interface";
import { PathService } from "./pathService";
import { ILikeService } from "./likeService.interface";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { DatabaseImageService } from "./databaseImageService";
import { ImageExistsError } from "../errors/imageErrors";

//TODO: does every method really need to await the userId from the username every time?
// is it better to store it as a field in the class?
export class ImageService implements IImageService {
  private mappingService: MappingService;
  private pathService: IPathService;
  private likeService: ILikeService;
  private databaseImageService: IDatabaseImageService;

  constructor(mappingService: MappingService = new MappingService(), pathService: IPathService = new PathService(), likeService: ILikeService = new LikeService(), databaseImageService: IDatabaseImageService = new DatabaseImageService()) {
    this.mappingService = mappingService;
    this.pathService = pathService;
    this.likeService = likeService;
    this.databaseImageService = databaseImageService;
  }

  async addImage(
    filename: string,
    data: string,
    username: string,
  ): Promise<Image> {
    try {
      const user: User = await this.mappingService.getUser(username);
      const filePath = await this.pathService.saveFile(user.id, filename, data);
      const dataBaseImage = await this.databaseImageService.addImage(
        user.id,
        filename,
        filePath
      );
      return dataBaseImage;
    } catch (e: any) {
      if (e.code === 11000 || e.code === 11001) {
        //codes represent a duplicate key error from mongodb => image exists
        throw new ImageExistsError(filename); //in case the image already exists for the user.
      } else {
        throw new Error(e);
      }
    }
  }

  async getImages(
    sortField: string = "uploadDate",
    sortOrder: string = "desc",
    username: string,
    onlyLiked: boolean = false
  ): Promise<Image[]> {
    try {
      const user: User = await this.mappingService.getUser(username);
      let query: any = { userId: user.id };
      const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };
      // This could also be moved to the databaseImageService, but not direct dependency on mongo
      let likedImageIds: string[];
      if (onlyLiked) {
        likedImageIds = await this.likeService.getLikedImages(username);
      }else{
        likedImageIds = [];
      }
      const images = await this.databaseImageService.getImages(
        user.id,
        query,
        sortOptions,
        likedImageIds
      );
      return images;
    } catch (error) {
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async deleteImage(imageId: string, username: string): Promise<boolean> {
    const user: User = await this.mappingService.getUser(username);
    try {
      const image = await this.databaseImageService.findImageById(imageId);
      await this.pathService.deleteFile(user.id, image.filename);
      try {
        await this.likeService.unlikeImage(imageId, username);
      } catch (error) {
      }
      return await this.databaseImageService.deleteImage(imageId);
    } catch (error) {
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async getImageBySearch(search: string, username: string): Promise<Image[]> {
    try {
      const user: User = await this.mappingService.getUser(username);
      const images = await this.databaseImageService.getImageBySearch(user.id, search);
      return images;
    } catch (error) {
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  //TODO: can we look into the error handling and divide into cases, depending on the error?
  async changeImageName(imageId: string, newFilename: string, username: string): Promise<boolean> {
    try {
        const user: User = await this.mappingService.getUser(username);
        const imageDocument = await this.databaseImageService.findImageById(imageId);
        // Call the path service to rename the file, returns the new file path
        const newFilePath = await this.pathService.renameFile(user.id, imageDocument.filename, newFilename);
        return await this.databaseImageService.renameImage(imageId, newFilename, newFilePath);
    } catch (error) {
        throw error; // Re-throw the error to be handled by the caller
    }
}

}

export { ImageExistsError };

