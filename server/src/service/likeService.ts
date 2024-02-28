import { Image } from "../model/image";
import {ILikeService} from "./likeService.interface"
import {likeImage} from "../db/like.db";
import { imageModel } from "../db/image.db";
import { ImageNotFoundError } from "./imageService";
import { DeleteResult } from "mongodb";
import { LikedImage } from "../model/likedImage";
import { Model } from "mongoose";

export class LikeService implements ILikeService{
    //private likes: Set<string>; // Set of image IDs that the user has liked

    constructor() {
        //this.likes = new Set<string>();
    }

    async isImageLiked(imageId : string, userId: string): Promise<boolean> {
        //return 
        const lm: Model<LikedImage> = await likeImage;
        const im: Model<Image> = await imageModel;

        const img = await im.findOne({ 
            _id : imageId, //?? How is this working even though _id is ObjectId and imageId is number??
            userId : userId
        })
        if (img === null) { //check if image even exists
            throw new ImageNotFoundError(imageId);
        }
        const like = await lm.findOne({
            imageId: img._id, 
            userId: userId,  
        });
        return (like !== null);
    }

    async likeImage(imageId : string, userId: string): Promise<void> {
        const lm: Model<LikedImage> = await likeImage;

        try{
            await lm.create({
                imageId: imageId, 
                userId: userId,  
            });
        }catch(e: any){
            if (e.code === 11000 || e.code === 11001) { //codes represent a duplicate key error from mongodb => like exists
                throw new LikeExistsError(imageId);
            } else {
                throw new Error(e);
            }
        }
        //this.likes.add(imageId);
    }

    async unlikeImage(imageId : string, userId: string): Promise<void> {
        const lm: Model<LikedImage> = await likeImage;

        if(await lm.findOne({imageId: imageId, userId: userId})){
            const result: DeleteResult = await lm.deleteOne({ //we can use deleteOne because the combination of imageId and userId is unique
                imageId: imageId, 
                userId: userId,  
            });
            if (!result.acknowledged) {
                throw new Error("Error deleting like");
            }
        }else{
            throw new ImageNotFoundError(imageId);
        }
        //this.likes.delete(imageId);
    }

    //TODO: is this necessary?
    async getLikedImages(userId: string): Promise<Image[]> {
        const lm: Model<LikedImage> = await likeImage;
        //const im: Model<Image> = await imageModel;

        const likedImages = await lm.find<Image>({userId: userId}); //Will this return a list of documents referencing documents in "image collection" or a list of imageIds?
        //const likedImagesList = likedImages.map(async (img) => {await im.findOne({_id: img.imageId})}); //In case the line above returns Ids.
        if (likedImages === null) {
            return [];
        }else{
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