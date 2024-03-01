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

});

async function makeModel(): Promise<Model<User>>{
    const um = await (await conn).model<User>("Users Collection", Users);
    console.log(await (await conn).db.collections())
    return um
}

export const userModel: Promise<Model<User>> = makeModel();