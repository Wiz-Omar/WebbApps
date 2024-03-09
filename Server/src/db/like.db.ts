import { Model, Schema } from "mongoose";
import { conn } from "./conn";
import { Images } from "./image.db";
import { ObjectId } from "mongodb";
import {LikedImage} from "../model/likedImage";

/**
 * Schema for the liked images collection in the database.
 * It contains the image ID and user ID for each like.
 * The image ID is a reference to the image that is liked.
 * The user ID is a reference to the user who likes the image.
 * The combination of the image ID and user ID must be unique.
 */
const LikedImages : Schema = new Schema({
 
 imageId : {
   type : ObjectId,
   ref : "Images Collection",
   required : true
 },

 userId : {
   type : String,
   ref : "Users Collection",
   required : true
 }
});

// Index for the liked images collection.
// The combination of the image ID and user ID must be unique. This means a user cannot have more than one like on an image.
LikedImages.index({ imageId: 1, userId: 1 }, { unique: true });
async function makeModel(): Promise<Model<LikedImage>>{
    return (await conn).model<LikedImage>("Liked Images Collection", LikedImages);
}

export const likeImage: Promise<Model<LikedImage>> = makeModel();