import { Image } from "../model/image";
import { validSortFields, validSortOrders } from "../model/sorting";
import { LikeService } from "./likeService";
import { IImageService } from "./imageService.interface";
import {imageModel} from "../db/image.db";
import { DeleteResult } from "mongodb";
import mongoose, { Model } from "mongoose";

export class ImageService implements IImageService {

    async addImage(filename: string, url: string, userId: string): Promise<Image> {
        const im: Model<Image> = await imageModel;

        try{
            return await im.create({
                userId: userId,  
                filename: filename, 
                url: url,
                uploadDate: new Date(),
            });
        }catch(e: any){
            if (e.code === 11000 || e.code === 11001) { //codes represent a duplicate key error from mongodb => image exists
                throw new ImageExistsError(filename); //in case the image already exists for the user
              } else {
                throw new Error(e);
              }
        }
    }

    async getImages(sortField: string = 'filename', sortOrder: string = 'asc', userId: string): Promise<Image[]> {
        const im: Model<Image> = await imageModel;

        //TODO: figure out sorting in mongodb
        //TODO: error check for user existing and logged in
        return await im.find({userId: userId});
    }

    async deleteImage(imageId: string, userId: string): Promise<boolean> {
        const im: Model<Image> = await imageModel;
        //TODO: integrate userId into the query.
        const result: DeleteResult = await im.deleteOne({_id: imageId});
        if (result.acknowledged){
            if (result.deletedCount === 1) {
                return true;
            }else{
                throw new ImageNotFoundError(imageId);
            }
        }else { //means that result.aknowledged is false so something went wrong when querying the db
            throw new Error("Error deleting image");
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
