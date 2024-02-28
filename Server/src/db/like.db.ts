import { Model, Schema } from "mongoose";
import { conn } from "./conn";
import { Images } from "./image.db";
import { ObjectId } from "mongodb";
import {LikedImage} from "../model/likedImage";

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

LikedImages.index({ imageId: 1, userId: 1 }, { unique: true });
async function makeModel(): Promise<Model<LikedImage>>{
    return (await conn).model<LikedImage>("Liked Images Collection", LikedImages);
}

export const likeImage: Promise<Model<LikedImage>> = makeModel();