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
import {
  FileOperationError,
  ImageExistsError,
  ImageNotFoundError,
} from "../errors/imageErrors";
import { UserNotFoundError } from "../errors/userErrors";
import { UserService } from "./userService";
import { IUserService } from "./userService.interface";
import { LikeNotFoundError } from "../errors/likeErrors";

/**
 * Service for handling image operations.
 * It is responsible for adding, getting and deleting images. Also handles renaming images and searching for images.
 * Delegates file operations to the path service and database operations to the database image service.
 * Delegates like operations to the like service and mapping operations to the mapping service.
 */
export class ImageService implements IImageService {
  //private mappingService: MappingService;
  private userService: IUserService;
  private pathService: IPathService;
  private likeService: ILikeService;
  private databaseImageService: IDatabaseImageService;

  constructor(
    //mappingService: MappingService = new MappingService(),
    userService: IUserService = new UserService(),
    pathService: IPathService = new PathService(),
    likeService: ILikeService = new LikeService(),
    databaseImageService: IDatabaseImageService = new DatabaseImageService(),
  ) {
    //this.mappingService = mappingService;
    this.userService = userService;
    this.pathService = pathService;
    this.likeService = likeService;
    this.databaseImageService = databaseImageService;
  }

  /**
   * Retrieves a user by their username.
   * @param username 
   * @returns A promise that resolves to a User object.
   */
  private async getUser(username: string): Promise<User> {
    return this.userService.getUser(username);
  }

  /**
   * Adds an image to the database associated with a specific user.
   * 
   * Retrieves the user by their username using the mapping service,
   * then saves the image file using the path service. Finally, it adds the image
   * information to the database through the database image service.
   * 
   * @param {string} filename The name of the image file.
   * @param {string} data The base64 encoded image data.
   * @param {string} username The username of the user who owns the image.
   * 
   * @returns {Promise<Image>} A promise that resolves to an Image object.
   */
  async addImage(
    filename: string,
    data: string,
    username: string
  ): Promise<Image> {
    try {
      const user: User = await this.getUser(username);
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
      } else if (e instanceof FileOperationError) {
        throw new FileOperationError();
      } else {
        throw new Error(e);
      }
    }
  }

  /**
   * Retrieves an array of images associated with a specific user. 
   * 
   * Allows filtering images by whether they are liked by the user and supports sorting by
   * a specified field in either ascending or descending order.
   *
   * @param {string} sortField The field to sort the images by. Defaults to "uploadDate".
   * @param {string} sortOrder The order to sort the images by. Defaults to "desc".
   * @param {string} username The username of the user who owns the images.
   * @param {boolean} onlyLiked Whether to only return images that the user has liked. Defaults to false.
   * 
   * @returns {Promise<Image[]>} A promise that resolves to an array of Image objects.
   */
  async getImages(
    sortField: string = "uploadDate",
    sortOrder: string = "desc",
    username: string,
    onlyLiked: boolean = false
  ): Promise<Image[]> {
    try {
      const user: User = await this.getUser(username);
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
   * 
   * Retrieves the user by their username, then finds the image by its ID
   * and deletes the corresponding file using the path service. It also attempts to remove any
   * likes associated with the image before finally deleting the image record from the database.
   * 
   * @param {string} imageId The unique identifier of the image to delete.
   * @param {string} username The username of the user who owns the image.
   * 
   * @returns {Promise<boolean>} A promise that resolves to true if the image was successfully deleted, or false if the image was not found.
   */
  async deleteImage(imageId: string, username: string): Promise<boolean> {
    const user: User = await this.getUser(username);
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
      } else if (error instanceof FileOperationError) {
        throw new FileOperationError();
      } else {
        throw error;
      }
    }
  }

  /**
   * Retrieves an array of images.
   * 
   * Retrieves images associated with a specific user that match a search string.
   * This function first retrieves the user by their username, then calls the database image
   * service to retrieve the images that match the search string.
   * 
   * @param {string} search The search string to match against image filenames.
   * @param {string} username The username of the user who owns the images.
   * 
   * @returns {Promise<Image[]>} A promise that resolves to an array of Image objects that match the search string.
   */
  async getImageBySearch(search: string, username: string): Promise<Image[]> {
    try {
      const user: User = await this.getUser(username);
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
   * Renames an image. 
   * 
   * This function first retrieves the user by their username,
   * then finds the image by its ID and calls the path service to rename the file. Finally, it updates the image
   * record in the database with the new filename and file path.
   * 
   * @param {string} imageId The unique identifier of the image to rename.
   * @param {string} newFilename The new filename for the image.
   * @param {string} username The username of the user who owns the image.
   * 
   * @returns {Promise<boolean>} A promise that resolves to true if the image was successfully renamed, or false if the image was not found.
   */
  async changeImageName(
    imageId: string,
    newFilename: string,
    username: string
  ): Promise<boolean> {
    try {
      const user: User = await this.getUser(username);
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
      } else if (error instanceof FileOperationError) {
        throw new FileOperationError();
      } else {
        throw error;
      }
    }
  }
}
