import { Model, Schema } from "mongoose";
import { Image } from "../model/image";
import { conn } from "./conn";
import { ObjectId } from "mongodb";

export const Images: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "Users Collection",
  },

  filename: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },

  uploadDate: {
    type: Date,
    required: true,
  },
});

Images.index({ filename: 1, userId: 1 }, { unique: true });
async function makeModel(): Promise<Model<Image>> {
  return (await conn).model<Image>("Images Collection", Images);
}

export const imageModel: Promise<Model<Image>> = makeModel();
