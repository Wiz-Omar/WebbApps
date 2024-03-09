import { ObjectId } from "mongodb";

/**
 * DatabaseUser is the type of the user object that is stored in the database.
 */
export interface DatabaseUser {
  _id: ObjectId;
  username: string;
  password: string;
}
