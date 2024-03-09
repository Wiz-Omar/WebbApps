import { ILikeService } from "./likeService.interface";
import { likeImage } from "../db/like.db";

import { DeleteResult } from "mongodb";
import { LikedImage } from "../model/likedImage";
import mongoose, { Model } from "mongoose";
import { User } from "../model/user";
import { ImageNotFoundError, InvalidIdError } from "../errors/imageErrors";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { DatabaseImageService } from "./databaseImageService";
import { UserNotFoundError } from "../errors/userErrors";
import { IUserService } from "./userService.interface";
import { UserService } from "./userService";
import { Image } from "../model/image";
import { LikeExistsError, LikeNotFoundError } from "../errors/likeErrors";

const ObjectId = mongoose.Types.ObjectId;

/**
 * Service for handling like operations.
 * It is responsible for liking and unliking images, as well as checking if an image is liked.
 * Also handles getting a list of images liked by a user.
 */
export class LikeService implements ILikeService {
  userService: IUserService;
  databaseImageService: IDatabaseImageService;

  constructor(
    userService: IUserService = new UserService(),
    databaseImageService: IDatabaseImageService = new DatabaseImageService()
  ) {
    this.userService = userService;
    this.databaseImageService = new DatabaseImageService();
  }

  /**
   * Retrieves the LikedImage model from the database.
   * @returns {Promise<Model<LikedImage>>} The LikedImage model.
   */
  private async getLikeImageModel(): Promise<Model<LikedImage>> {
    return await likeImage;
  }

  /**
   * Retrieves a user by username.
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<User>} The user object.
   */
  private async getUser(username: string): Promise<User> {
    return this.userService.getUser(username);
  }

  /**
   * Retrieves an image by its ID.
   * @param {string} imageId - The ID of the image to retrieve.
   * @returns {Promise<Image>} The image object.
   */
  private async getImage(imageId: string): Promise<Image> {
    return this.databaseImageService.findImageById(imageId);
  }

  /**
   * Checks if an image is liked by a user. 
   * 
   * This method checks if a like exists for the given image and user in the database, by querying the LikedImage collection
   * and checking if a document exists with the given image ID and user ID.
   * 
   * @param {string} imageId - The ID of the image.
   * @param {string} username - The username of the user.
   * @returns {Promise<boolean>} True if the image is liked, false otherwise.
   * 
   * @throws {UserNotFoundError} When the user is not found.
   * @throws {InvalidIdError} When the image ID is invalid (not a valid ObjectId).
   * @throws {ImageNotFoundError} When the image is not found.
   */
  async isImageLiked(imageId: string, username: string): Promise<boolean> {
    if (!ObjectId.isValid(imageId)) throw new InvalidIdError(imageId);
    try {
      const lm: Model<LikedImage> = await this.getLikeImageModel();
      const user: User = await this.getUser(username);
      const imageExists = await this.getImage(imageId);
      if (!imageExists) throw new ImageNotFoundError(imageId);
      const like = await lm.findOne({
        imageId: new ObjectId(imageId),
        userId: user.id,
      });
      return like !== null;
    } catch (e: any) {
      if (e instanceof UserNotFoundError) {
        throw new UserNotFoundError(username);
      } else {
        throw e;
      }
    }
  }

  /**
   * Likes an image for a user.
   * 
   * This method creates a new document in the LikedImage collection to represent the like. 
   * It first checks if the user and image exist, and then creates a new like document with the user ID and image ID.
   * 
   * @param {string} imageId - The ID of the image to like.
   * @param {string} username - The username of the user liking the image.
   * @returns {Promise<void>} A Promise that resolves when the image is liked.
   * 
   * @throws {InvalidIdError} When the image ID is invalid (not a valid ObjectId).
   * @throws {LikeExistsError} When the like already exists for the image and user.
   * @throws {ImageNotFoundError} When the image is not found.
   * @throws {UserNotFoundError} When the user is not found.
   */
  async likeImage(imageId: string, username: string): Promise<void> {
    if (!ObjectId.isValid(imageId)) {
      throw new InvalidIdError(imageId);
    }
    try {
      const lm: Model<LikedImage> = await this.getLikeImageModel();
      // Ensure the user exists, and get the user
      const user: User = await this.getUser(username);
      // Ensure the image exists
      const imageExists = await this.getImage(imageId);
      if (!imageExists) throw new ImageNotFoundError(imageId);
      // Create a new like
      await lm.create({
        imageId: new ObjectId(imageId),
        userId: user.id,
      });
    } catch (e: any) {
      if (e.code === 11000 || e.code === 11001) {
        //codes represent a duplicate key error from mongodb => like exists
        throw new LikeExistsError(imageId);
        // catch error that User does not exist
      } else if (e instanceof ImageNotFoundError) {
        throw new ImageNotFoundError(imageId);
      } else if (e instanceof UserNotFoundError) {
        throw new UserNotFoundError(username);
        // catch error that Image does not exist
      } else {
        throw new Error(
          "Unexpected error when trying to like the image: " + e.message
        );
      }
    }
  }

   /**
   * Unlikes an image for a user.
   * 
   * This method deletes a document from the LikedImage collection to represent the like being removed.
   * It first checks if the user and image exist, and then deletes the like document with the user ID and image ID.
   * 
   * @param {string} imageId - The ID of the image to unlike.
   * @param {string} username - The username of the user unliking the image.
   * @returns {Promise<void>} A Promise that resolves when the image is unliked.
   * 
   * @throws {InvalidIdError} When the image ID is invalid (not a valid ObjectId).
   * @throws {LikeNotFoundError} When the like does not exist for the image and user.
   * @throws {ImageNotFoundError} When the image is not found.
   * @throws {UserNotFoundError} When the user is not found.
   */
  async unlikeImage(imageId: string, username: string): Promise<void> {
    if (!ObjectId.isValid(imageId)) {
      throw new InvalidIdError(imageId);
    }

    try {
      const lm: Model<LikedImage> = await this.getLikeImageModel();
      // Ensure the user exists, and get the user
      const user: User = await this.getUser(username);
      // Ensure the image exists
      const imageExists = await this.getImage(imageId);
      if (!imageExists) {
        throw new ImageNotFoundError(imageId);
      }

      // Delete the like
      const result: DeleteResult = await lm.deleteOne({
        imageId: new ObjectId(imageId),
        userId: user.id,
      });

      if (!result.acknowledged) {
        throw new LikeNotFoundError(imageId);
      }
    } catch (e: any) {
      if (e instanceof UserNotFoundError) {
        throw e; // User not found
      } else if (e instanceof ImageNotFoundError) {
        throw new ImageNotFoundError(imageId);
      } else if (e instanceof LikeNotFoundError) {
        throw e; // Like not found
      } else {
        throw new Error(
          "Unexpected error when trying to unlike the image: " + e.message
        );
      }
    }
  }

  /**
   * Retrieves a list of image IDs that a user has liked.
   * 
   * This method retrieves a list of image IDs from the LikedImage collection that are associated with the user.
   * It first checks if the user exists, and then retrieves the list of image IDs from the like documents.
   * 
   * @param {string} username - The username of the user.
   * @returns {Promise<string[]>} A Promise that resolves with a list of image IDs that the user has liked.
   * 
   * @throws {UserNotFoundError} When the user is not found.
   */
  async getLikedImages(username: string): Promise<string[]> {
    const lm: Model<LikedImage> = await this.getLikeImageModel();
    const user: User = await this.getUser(username);

    // Find liked images by user ID and only select the imageId field
    const likedImagesDocuments = await lm
      .find({ userId: user.id }, "imageId")
      .exec();

    if (!likedImagesDocuments || likedImagesDocuments.length === 0) {
      return [];
    } else {
      // Map the documents to extract the imageId values and convert them to string
      const likedImageIds: string[] = likedImagesDocuments.map((doc) =>
        doc.imageId.toString()
      );
      return likedImageIds; // Returns the IDs of Images that the user has liked
    }
  }
}
