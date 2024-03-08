import { ILikeService } from "./likeService.interface";
import { likeImage } from "../db/like.db";

import { DeleteResult } from "mongodb";
import { LikedImage } from "../model/likedImage";
import mongoose, { Model } from "mongoose";
import { User } from "../model/user";
import { MappingService } from "./mappingService";
import { ImageNotFoundError } from "../errors/imageErrors";
import { IMappingService } from "./mappingService.interface";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { DatabaseImageService } from "./databaseImageService";
import { UserNotFoundError } from "../errors/userErrors";

const ObjectId = mongoose.Types.ObjectId;

/**
 * Service for handling like operations.
 * It is responsible for liking and unliking images, as well as checking if an image is liked.
 * Also handles getting a list of images liked by a user.
 */
export class LikeService implements ILikeService {
  mappingService: IMappingService;
  databaseImageService: IDatabaseImageService;

  constructor() {
    this.mappingService = new MappingService();
    this.databaseImageService = new DatabaseImageService();
  }


  async isImageLiked(imageId: string, username: string): Promise<boolean> {
    if (!ObjectId.isValid(imageId)) throw new InvalidIdError(imageId);
    try {
      const lm: Model<LikedImage> = await likeImage;
      const user: User = await this.mappingService.getUser(username);
      const imageExists = await this.databaseImageService.findImageById(
        imageId
      );
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

  async likeImage(imageId: string, username: string): Promise<void> {
    if (!ObjectId.isValid(imageId)) {
      throw new InvalidIdError(imageId);
    }
    try {
      const lm: Model<LikedImage> = await likeImage;
      // Ensure the user exists, and get the user
      const user: User = await this.mappingService.getUser(username);
      // Ensure the image exists
      const imageExists = await this.databaseImageService.findImageById(
        imageId
      );
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

  async unlikeImage(imageId: string, username: string): Promise<void> {
    if (!ObjectId.isValid(imageId)) {
      throw new InvalidIdError(imageId);
    }

    try {
      const lm: Model<LikedImage> = await likeImage;
      // Ensure the user exists, and get the user
      const user: User = await this.mappingService.getUser(username);
      // Ensure the image exists
      const imageExists = await this.databaseImageService.findImageById(
        imageId
      );
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

  async getLikedImages(username: string): Promise<string[]> {
    const lm: Model<LikedImage> = await likeImage;
    const user: User = await this.mappingService.getUser(username);

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

export class InvalidIdError extends Error {
  constructor(imageId: string) {
    super(`Invalid image ID: ${imageId}`);
    this.name = "InvalidImageID";
  }
}

export class LikeExistsError extends Error {
  constructor(imageId: string) {
    super(`Like already exists for image with id ${imageId}`);
    this.name = "LikeExistsError";
  }
}

export class LikeNotFoundError extends Error {
  constructor(imageId: string) {
    super(`Like not found for image with id ${imageId}`);
    this.name = "LikeNotFoundError";
  }
}
