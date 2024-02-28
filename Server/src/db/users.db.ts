import {Model, Schema} from "mongoose";
import {User} from "../model/user";
import { conn } from "./conn";

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

}, {_id: false});

async function makeModel(): Promise<Model<User>>{
    return (await conn).model<User>("Users Collection", Users);
}

export const userModel: Promise<Model<User>> = makeModel();