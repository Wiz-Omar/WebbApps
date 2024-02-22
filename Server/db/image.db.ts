import {Schema, Model} from "mongoose";
import {Image} from "../src/model/image";
import { conn } from "./conn";

const Images : Schema = new Schema({

 id : {
   type : Number,
   required : true,
   unique: true
 },

 filename : {
   type : String,
   required : true
 },

 data : {
   type : String,
   required : true,
 },

 uploadDate : {
    type : Date,
    required : true,
    unique : true
 },

});

export const imageModel = conn.model<Image>("Images Collection", Images);