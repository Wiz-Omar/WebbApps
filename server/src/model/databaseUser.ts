import { ObjectId } from "mongodb";

export interface DatabaseUser {
    _id: ObjectId;
    username: string;
    password: string;
  }