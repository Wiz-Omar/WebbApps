import { Image } from "../model/image";
import { ILikeService } from "./likeService.interface";
import { likeImage } from "../db/like.db";
import { imageModel } from "../db/image.db";
import { ImageNotFoundError } from "./imageService";
import { DeleteResult } from "mongodb";
import { LikedImage } from "../model/likedImage";
import { Model } from "mongoose";
import { User } from "../model/user";
import { MappingService } from "./mappingService";

export class LikeService implements ILikeService {
  mappingService: MappingService = new MappingService();
  //private likes: Set<string>; // Set of image IDs that the user has liked

  constructor() {
    //this.likes = new Set<string>();
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
    //this.likes.delete(imageId);
  }

  //TODO: is this necessary?
  async getLikedImages(username: string): Promise<Image[]> {
    const lm: Model<LikedImage> = await likeImage;

    const likedImages = await lm.find<Image>({ username: username }); //Will this return a list of documents referencing documents in "image collection" or a list of imageIds?
    //const likedImagesList = likedImages.map(async (img) => {await im.findOne({_id: img.imageId})}); //In case the line above returns Ids.
    if (likedImages === null) {
      return [];
    } else {
      return likedImages; //returns the Images that the user has liked
    }
    //return Array.from(this.likes);
  }
}

class LikeExistsError extends Error {
  constructor(imageId: string) {
    super(`Like already exists for image with id ${imageId}`);
    this.name = "LikeExistsError";
  }
}
