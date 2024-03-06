import { ILikeService } from "./likeService.interface";
import { likeImage } from "../db/like.db";

import { DeleteResult } from "mongodb";
import { LikedImage } from "../model/likedImage";
import { Model } from "mongoose";
import { User } from "../model/user";
import { MappingService } from "./mappingService";
import { ImageNotFoundError } from "../errors/imageErrors";

export class LikeService implements ILikeService {
  mappingService: MappingService;

  constructor() {
    this.mappingService = new MappingService();
  }

  async isImageLiked(imageId: string, username: string): Promise<boolean> {
    const lm: Model<LikedImage> = await likeImage;
    const user: User = await this.mappingService.getUser(username);

    const like = await lm.findOne({
      imageId: imageId,
      userId: user.id,
    });
    
    return like !== null;
  }

  async likeImage(imageId: string, username: string): Promise<void> {
    const lm: Model<LikedImage> = await likeImage;
    const user: User = await this.mappingService.getUser(username);

    try {
      await lm.create({
        imageId: imageId,
        userId: user.id,
      });
    } catch (e: any) {
      if (e.code === 11000 || e.code === 11001) {
        //codes represent a duplicate key error from mongodb => like exists
        throw new LikeExistsError(imageId);
      } else {
        console.log(e);
        throw new Error(e);
      }
    }
  }

  async unlikeImage(imageId: string, username: string): Promise<void> {
    const lm: Model<LikedImage> = await likeImage;
    const user: User = await this.mappingService.getUser(username);

    if (await lm.findOne({ imageId: imageId, userId: user.id })) {
      const result: DeleteResult = await lm.deleteOne({
        //we can use deleteOne because the combination of imageId and username is unique
        imageId: imageId,
        userId: user.id,
      });
      if (!result.acknowledged) {
        throw new Error("Error deleting like");
      }
    } else {
      throw new ImageNotFoundError(imageId);
    }
  }

  async getLikedImages(username: string): Promise<string[]> {
    const lm: Model<LikedImage> = await likeImage;
    const user: User = await this.mappingService.getUser(username);

    // Find liked images by user ID and only select the imageId field
    const likedImagesDocuments = await lm.find({ userId: user.id }, 'imageId').exec();

    if (!likedImagesDocuments || likedImagesDocuments.length === 0) {
      return [];
    } else {
      // Map the documents to extract the imageId values and convert them to string
      const likedImageIds: string[] = likedImagesDocuments.map(doc => doc.imageId.toString());
      return likedImageIds; // Returns the IDs of Images that the user has liked
    }
}
}

class LikeExistsError extends Error {
  constructor(imageId: string) {
    super(`Like already exists for image with id ${imageId}`);
    this.name = "LikeExistsError";
  }
}
