import { Image } from "../model/image";

/**
 * Interface for the database image service.
 * It is responsible for adding, getting and deleting images from the database.
 */
export interface IDatabaseImageService {

  /**
   * Adds a new image to the database with the given user ID, filename, and file path.
   * @param userId The ID of the user who is adding the image. Type: string
   * @param filename The name of the file. Type: string
   * @param filePath The path where the file is stored. Type: string
   */
  addImage(userId: string, filename: string, filePath: string): Promise<Image>;

  /**
   * Retrieves a list of images for a given user, by optional filters.
   * @param userId The ID of the user who is adding the image. Type: string
   * @param sortOptions The sorting options for the images. Type: any
   * @param likedImageIds The IDs of the images that the user has liked. Type: string[]
   */
  getImages(userId: string, sortOptions: any, likedImageIds: string[]): Promise<Image[]>;

  /**
   * Deletes an image from the database.
   * @param imageId The ID of the image to delete. Type: string
   */
  deleteImage(imageId: string): Promise<boolean>;

  /**
   * Finds an image by its ID.
   * @param imageId The ID of the image to find. Type: string
   */
  findImageById(imageId: string): Promise<Image>;

  /**
   * Retrieves an image by its filename.
   * @param userId The ID of the user who owns the image. Type: string
   * @param filename The name of the image file. Type: string
   */
  getImageBySearch(userId: string, search: string): Promise<Image[]>;

  /**
   * Renames an image in the database.
   * @param imageId The ID of the image to rename. Type: string
   * @param oldFilename The current name of the image file. Type: string
   * @param newFilename The new name for the image file. Type: string
   */
  renameImage(imageId: string, oldFilename: string, newFilename: string): Promise<boolean>;
}
