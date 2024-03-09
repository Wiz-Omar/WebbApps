import { ObjectId } from "mongodb";

/**
 * DatabaseImage is the type of the image object that is stored in the database.
 */
export interface DatabaseImage {
  _id: ObjectId;
  filename: string;
  path: string;
  uploadDate: Date;
}
