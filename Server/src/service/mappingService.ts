import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { imageModel } from "../db/image.db";
import { userModel } from "../db/users.db";
import { User } from "../model/user";
import { IUserService } from "./userService.interface";
import { Image } from "../model/image";

export class MappingService{
    async getUser(username: string): Promise<User> {
        const um: Model<User> = await userModel;
        const databaseUser = await um.findOne({username: username});
        if (databaseUser === null) {
            throw new Error("User not found");
        }
        return mapDatabaseUserToUser(databaseUser);
    }
    async getImage(imageId: string): Promise<Image> {
        const im: Model<Image> = await imageModel;
        const databaseImage = await im.findOne({_id: new ObjectId(imageId)}); //imageId need to be valid according to mongodb.
        if (databaseImage === null) {
            throw new Error("Image not found");
        }
        return mapDatabaseImageToImage(databaseImage);
    }
}


export function mapDatabaseUserToUser(databaseUser: DatabaseUser): User {
    return {
        id: databaseUser._id.toString(),
        username: databaseUser.username,
        password: databaseUser.password
    }
}

interface DatabaseUser{
    _id: ObjectId,
    username: string,
    password: string
}


export function mapDatabaseImageToImage(databaseImage: DatabaseImage): Image {
    return {
        id: databaseImage._id.toString(),
        filename: databaseImage.filename,
        path: databaseImage.path,
        uploadDate: databaseImage.uploadDate
    }
}

interface DatabaseImage{
    _id: ObjectId,
    filename: string,
    path: string,
    uploadDate: Date
}