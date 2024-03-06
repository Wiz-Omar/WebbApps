import { Model } from "mongoose";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { Image } from "../model/image";
import { imageModel } from "../db/image.db";
import { MappingService } from "./mappingService";
import { ImageNotFoundError } from "./imageService";
import { ObjectId } from "mongodb";

//HUMBLE OBJECT, will not be tested
export class DatabaseImageService implements IDatabaseImageService {
  private mappingService: MappingService = new MappingService();

  async addImage(
    userId: string,
    filename: string,
    filePath: string
  ): Promise<Image> {
    const im: Model<Image> = await imageModel;
    const databaseImage = await im.create({
      userId: userId,
      filename: filename,
      path: filePath,
      uploadDate: new Date(),
    });
    return this.mappingService.mapDatabaseImageToImage(databaseImage);
  }

  async getImages(
    userId: string,
    query: any,
    sortOptions: any,
    likedImageIds: string[]
  ): Promise<Image[]> {
    const im: Model<Image> = await imageModel;
    if(likedImageIds.length > 0) {
      const objectIdList: ObjectId[] = likedImageIds.map((id: string) => new ObjectId(id));
      query._id = { $in: objectIdList };
    }
    console.log(query);
    const images = await im
      .find(query)
      .sort(sortOptions)
      //.limit(9)
      .exec();
  
    // Assuming mapDatabaseImageToImage correctly maps the document to your Image model
    console.log(images);
    return images.map(this.mappingService.mapDatabaseImageToImage);
  }
  
  async deleteImage(imageId: string): Promise<boolean> {
    const im: Model<Image> = await imageModel;
    const result = await im.deleteOne({ _id: imageId });
    return result.acknowledged && result.deletedCount === 1;
  }

  async findImageById(imageId: string): Promise<Image> {
    const im: Model<Image> = await imageModel;
    const databaseImage = await im.findOne
    ({_id: imageId});
    if (databaseImage === null) {
      throw new ImageNotFoundError(`Image with ID ${imageId} not found`);
    }
    return this.mappingService.mapDatabaseImageToImage(databaseImage);
  }

  async getImageBySearch(userId: string, search: string): Promise<Image[]> {
    const im: Model<Image> = await imageModel;
    const images = await im.find({
      userId: userId,
      filename: { $regex: search, $options: "i" },
    });
    return images.map(this.mappingService.mapDatabaseImageToImage);
  }

  async renameImage(imageId: string, newFilename: string, newFilepath: string): Promise<boolean> {
    const im: Model<Image> = await imageModel;

    // Find the image document to get the current filename
    const imageDocument = await im.findById(imageId);

    if (!imageDocument) {
        throw new ImageNotFoundError(`Image with ID ${imageId} not found`);
    }

    // Update the filename and path in the database
    await im.updateOne({ _id: imageId }, { $set: { filename: newFilename, path: newFilepath } });
    return true; // Return true if the filename is successfully changed

  }
}