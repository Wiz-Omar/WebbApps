import {Model, Schema} from "mongoose";
import {User} from "../model/user";
import { conn } from "./conn";

/**
 * Schema for the users collection in the database.
 * It contains the username and password for each user.
 * The username is the name of the user.
 * The password is the password of the user.
 */
export const Users : Schema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },

});

async function makeModel(): Promise<Model<User>>{
    const um = await (await conn).model<User>("Users Collection", Users);
    return um
}

export const userModel: Promise<Model<User>> = makeModel();