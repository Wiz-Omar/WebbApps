import { Schema } from "mongoose";
import { conn } from "./conn";
import { Image } from "../src/model/image";
import { Images } from "./image.db";
import { ObjectId } from "mongodb";

const LikedImages : Schema = new Schema({
 
 imageId : {
    type : ObjectId,
    ref : "Images Collection"
 },

 userId : {
 type : String,
 required : true,
 default : "defaultUser",
 unique: true
 }
});

//Images.index({ imageId: 1, userId: 1 }, { unique: true });
export const likeImage = conn.model("Like for images", LikedImages);