import { Image } from "../model/image";
import { validSortFields, validSortOrders } from "../model/sorting";
import { LikeService } from "./likeService";
import { IImageService } from "./imageService.interface";
import { imageModel } from "../db/image.db";
import { DeleteResult, ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { userModel } from "../db/users.db";
import { User } from "../model/user";
import { MappingService } from "./mappingService";
import { IPathService } from "./pathService.interface";
import { PathService } from "./pathService";
import { ILikeService } from "./likeService.interface";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { DatabaseImageService } from "./databaseImageService";

//TODO: does every method really need to await the userId from the username every time?
// is it better to store it as a field in the class?
export class ImageService implements IImageService {
  private mappingService: MappingService;
  private pathService: IPathService;
  private likeService: ILikeService;
  private databaseImageService: IDatabaseImageService;

  constructor() {
    this.mappingService = new MappingService();
    this.pathService = new PathService();
    this.likeService = new LikeService();
    this.databaseImageService = new DatabaseImageService();
  }

  //TODO: change name, path should be data?
  //TODO: does not need to return the image, just a boolean if it was added or not?
  async addImage(
    filename: string,
    data: string,
    username: string,
    onlyLiked: boolean = false
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
        //TODO: delete the file from the file system that was uploaded.
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
      if (onlyLiked) {
        const likedImageIds = await this.likeService.getLikedImages(username);
        if (likedImageIds.length > 0) {
          query._id = { $in: likedImageIds.map((id) => new ObjectId(id)) };
        } else {
          return []; // Early return if there are no liked images
        }
      }
      const images = await this.databaseImageService.getImages(
        user.id,
        query,
        sortOptions
      );
      return images;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async deleteImage(imageId: string, username: string): Promise<boolean> {
    const user: User = await this.mappingService.getUser(username);
    try {
      const image = await this.databaseImageService.findImageById(imageId);
      await this.pathService.deleteFile(user.id, image.filename);
      await this.likeService.unlikeImage(imageId, username);
      return await this.databaseImageService.deleteImage(imageId);
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async getImageBySearch(search: string, username: string): Promise<Image[]> {
    try {
      const user: User = await this.mappingService.getUser(username);
      const images = await this.databaseImageService.getImageBySearch(user.id, search);
      return images;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}

export class ImageNotFoundError extends Error {
  constructor(imageId: string) {
    super(`Image with id ${imageId} not found`);
    this.name = "ImageNotFoundError";
  }
}
class ImageExistsError extends Error {
  constructor(filename: string) {
    super(`Image with id ${filename} already exists`);
    this.name = "ImageExistsError";
  }
}
