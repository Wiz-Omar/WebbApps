import { Image } from "../model/image";
import { validSortFields, validSortOrders } from "../model/sorting";
import { LikeService } from "./likeService";
import { IImageService } from "./imageService.interface";
import {imageModel} from "../db/image.db";
import { DeleteResult, ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { userModel } from "../db/users.db";
import { User } from "../model/user";
import { mapDatabaseImageToImage, mappingService } from "./mappingService";

export class ImageService implements IImageService {
    mappingService: mappingService = new mappingService();

    async addImage(filename: string, url: string, username: string): Promise<Image> {
        const im: Model<Image> = await imageModel;

        try{
            const user: User = await this.mappingService.getUser(username);
            return mapDatabaseImageToImage(await im.create({
                userId: user.id,
                filename: filename, 
                url: url,
                path: "path", //TODO: figure out how to store the image in the server
                uploadDate: new Date(),
            }));
        }catch(e: any){
            if (e.code === 11000 || e.code === 11001) { //codes represent a duplicate key error from mongodb => image exists
                throw new ImageExistsError(filename); //in case the image already exists for the user
              } else {
                throw new Error(e);
              }
        }
    }

    async getImages(sortField: string = 'filename', sortOrder: string = 'asc', username: string): Promise<Image[]> {
        const im: Model<Image> = await imageModel;
        const user: User = await this.mappingService.getUser(username);

        //TODO: figure out sorting in mongodb
        //TODO: error check for user existing and logged in
        const databaseImages = await im.find({userId: user.id});
        return databaseImages.map(mapDatabaseImageToImage); //?? does it work?
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