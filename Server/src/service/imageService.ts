import { Image } from "../model/image";
import { validSortFields, validSortOrders } from "../model/sorting";
import { LikeService } from "./likeService";
import { IImageService } from "./imageService.interface";
import { imageModel } from "../db/image.db";
import { DeleteResult, ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { userModel } from "../db/users.db";
import { User } from "../model/user";
import { mapDatabaseImageToImage, MappingService } from "./mappingService";
import { IPathService } from "./IPathService";
import { LocalPathService } from "./LocalPathService";

//TODO: does every method really need to await the userId from the username every time?
// is it better to store it as a field in the class?
export class ImageService implements IImageService {
  private mappingService: MappingService = new MappingService();
  private pathService: IPathService = new LocalPathService();

  //TODO: change name, path should be data?
  //TODO: does not need to return the image, just a boolean if it was added or not?
  async addImage(
    filename: string,
    data: string,
    username: string
  ): Promise<Image> {
    try {
      const im: Model<Image> = await imageModel;
      const user: User = await this.mappingService.getUser(username);

      const filePath = await this.pathService.saveFile(user.id, filename, data);

      const dataBaseImage = await im.create({
        userId: user.id,
        filename: filename,
        path: filePath,
        uploadDate: new Date(),
      });

      return mapDatabaseImageToImage(dataBaseImage);
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
    username: string
  ): Promise<Image[]> {
    // Convert sortOrder to a number for MongoDB sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    //TODO: look into .limit(). Seems to crash with more than 6 images right now.
    try {
      const im: Model<Image> = await imageModel;
      // Get the user
      const user: User = await this.mappingService.getUser(username);
      // Use the sortField and sortDirection in the sort() method
      const images = await im
        .find({ userId: user.id })
        .sort({ [sortField]: sortDirection })
        .limit(9);

      // convert the images to an array of Image objects
      return images.map((image) => mapDatabaseImageToImage(image));
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async deleteImage(imageId: string, username: string): Promise<boolean> {
    const im: Model<Image> = await imageModel;
    const user: User = await this.mappingService.getUser(username);

    // First, find the image document to get the filename
    const imageDocument = await im.findById(imageId);

    if (!imageDocument) {
      throw new ImageNotFoundError(`Image with ID ${imageId} not found.`);
    }

    // does not need be awaited?
    await this.pathService.deleteFile(user.id, imageDocument.filename);

    // Proceed with deleting the document from the database
    const result: DeleteResult = await im.deleteOne({ _id: imageId });
    if (result.acknowledged && result.deletedCount === 1) {
      return true;
    } else {
      // This means that the deletion was not successful
      throw new Error(`Error deleting image with ID ${imageId}`);
    }
  }

  async getImageBySearch(search: string, username: string): Promise<Image[]> {
    try {
      const im: Model<Image> = await imageModel;
      const user: User = await this.mappingService.getUser(username);

      const images = await im.find({
        filename: { $regex: search, $options: "i" },
        userId: user.id,
      });
      return images.map((image) => mapDatabaseImageToImage(image));
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
