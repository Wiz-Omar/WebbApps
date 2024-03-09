import { Model, Schema } from "mongoose";
import { Image } from "../model/image";
import { conn } from "./conn";

/**
 * Schema for the images collection in the database.
 * It contains the user ID, filename, file path, and upload date for each image.
 * The user ID is a reference to the user who owns the image.
 * The filename is the name of the file.
 * The file path is the path where the file is stored in local storage.
 * The upload date is the date and time when the image was added to the database.
 * The combination of the filename and user ID must be unique.
 */
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

// Index for the images collection.
// The combination of the filename and user ID must be unique. This means a user cannot have two images with the same filename.
Images.index({ filename: 1, userId: 1 }, { unique: true });
async function makeModel(): Promise<Model<Image>> {
  return (await conn).model<Image>("Images Collection", Images);
}

export const imageModel: Promise<Model<Image>> = makeModel();
