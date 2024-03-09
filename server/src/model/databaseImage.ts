import { ObjectId } from "mongodb";

export interface DatabaseImage {
  _id: ObjectId;
  filename: string;
  path: string;
  uploadDate: Date;
}
