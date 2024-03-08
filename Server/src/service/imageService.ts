import { Image } from "../model/image";
import { LikeNotFoundError, LikeService } from "./likeService";
import { IImageService } from "./imageService.interface";
import { User } from "../model/user";
import { MappingService } from "./mappingService";
import { IPathService } from "./pathService.interface";
import { PathService } from "./pathService";
import { ILikeService } from "./likeService.interface";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { DatabaseImageService } from "./databaseImageService";
import {
  FileSaveError,
  ImageExistsError,
  ImageNotFoundError,
} from "../errors/imageErrors";
import { UserNotFoundError } from "../errors/userErrors";
import { val } from "cheerio/lib/api/attributes";

/**
 * Service for handling image operations.
 * It is responsible for adding, getting and deleting images. Also handles renaming images and searching for images.
 */
export class ImageService implements IImageService {
  private mappingService: MappingService;
  private pathService: IPathService;
  private likeService: ILikeService;
  private databaseImageService: IDatabaseImageService;

  constructor(
    mappingService: MappingService = new MappingService(),
    pathService: IPathService = new PathService(),
    likeService: ILikeService = new LikeService(),
    databaseImageService: IDatabaseImageService = new DatabaseImageService()
  ) {
    this.mappingService = mappingService;
    this.pathService = pathService;
    this.likeService = likeService;
    this.databaseImageService = databaseImageService;
  }

  /**
   * Adds an image to the database associated with a specific user.
   * The function first retrieves the user by their username using the mapping service,
   * then saves the image file using the path service. Finally, it adds the image
   * information to the database through the database image service.
   */
  async addImage(
    filename: string,
    data: string,
    username: string
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
      } else if (e instanceof UserNotFoundError) {
        throw new UserNotFoundError(username);
      } else if (e instanceof FileSaveError) {
        throw new FileSaveError();
      } else {
        throw new Error(e);
      }
    }
  }

  /**
   * Retrieves an array of images associated with a specific user. The function allows
   * filtering images by whether they are liked by the user and supports sorting by
   * a specified field in either ascending or descending order.
   *
   */
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
      let likedImageIds: string[] | null;

      if (onlyLiked) {
        likedImageIds = await this.likeService.getLikedImages(username);
        // If the user has not liked any images, return an empty array
        if (!likedImageIds || likedImageIds.length === 0) {
          const emptyImages: Image[] = [];
          return emptyImages;
        }
      } else {
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
      if (error instanceof UserNotFoundError) {
        throw new UserNotFoundError(username);
      } else {
        throw error;
      }
    }
  }

  /**
   * Deletes an image from the database and file system associated with a specific user.
   * This function first retrieves the user by their username, then finds the image by its ID
   * and deletes the corresponding file using the path service. It also attempts to remove any
   * likes associated with the image before finally deleting the image record from the database.
   */
  async deleteImage(imageId: string, username: string): Promise<boolean> {
    const user: User = await this.mappingService.getUser(username);
    try {
      const image = await this.databaseImageService.findImageById(imageId);
      // Call the path service to delete the file
      await this.pathService.deleteFile(user.id, image.filename);
      try {
        await this.likeService.unlikeImage(imageId, username);
      } catch (error) {
        // If the image is not liked by the user, the unlike operation will throw an error
        if (!(error instanceof LikeNotFoundError)) {
          throw error;
        }
      }
      return await this.databaseImageService.deleteImage(imageId);
    } catch (error) {
      if (error instanceof ImageNotFoundError) {
        throw new ImageNotFoundError(imageId);
      } else if (error instanceof FileSaveError) {
        throw new FileSaveError();
      } else {
        throw error;
      }
    }
  }

  /**
   * Retrieves an array of images associated with a specific user that match a search string.
   * This function first retrieves the user by their username, then calls the database image
   * service to retrieve the images that match the search string.
   */
  async getImageBySearch(search: string, username: string): Promise<Image[]> {
    try {
      const user: User = await this.mappingService.getUser(username);
      const images = await this.databaseImageService.getImageBySearch(
        user.id,
        search
      );
      return images;
    } catch (error) {
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Renames an image associated with a specific user. This function first retrieves the user by their username,
   * then finds the image by its ID and calls the path service to rename the file. Finally, it updates the image
   * record in the database with the new filename and file path.
   */
  async changeImageName(
    imageId: string,
    newFilename: string,
    username: string
  ): Promise<boolean> {
    try {
      const user: User = await this.mappingService.getUser(username);
      const imageDocument = await this.databaseImageService.findImageById(
        imageId
      );
      // Call the path service to rename the file, returns the new file path
      const newFilePath = await this.pathService.renameFile(
        user.id,
        imageDocument.filename,
        newFilename
      );
      // Call the database image service to rename the image
      return await this.databaseImageService.renameImage(
        imageId,
        newFilename,
        newFilePath
      );
    } catch (error) {
      if (error instanceof ImageNotFoundError) {
        throw new ImageNotFoundError(imageId);
      } else if (error instanceof FileSaveError) {
        throw new FileSaveError();
      } else {
        throw error;
      }
    }
  }
}

export { ImageExistsError };
