import {Schema} from "mongoose";
import {Image} from "../src/model/image";
import { conn } from "./conn";
import { ObjectId } from "mongodb";

export const Images : Schema = new Schema({
 _id : ObjectId,

 imageId : {
 type : Number,
 required : true,
 unique: true

 },

 userId : {
 type : String,
 required : true,
 default : "defaultUser",
 unique: true
 },
 
 filename : {
 type : String,
 required : true

 },

 url : {
 type : String,
 required : true,
 uniques : true

 },

 uploadDate : {
 type : Date,
 required : true,
 unique : true
 }
});

Images.index({ imageId: 1, userId: 1 }, { unique: true });
export const imageModel = conn.model<Image>("Images Collection", Images);