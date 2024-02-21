import { Image } from "../model/image";
import { validSortFields, validSortOrders } from "../model/sorting";
import { LikeService } from "./likeService";
import { IImageService } from "./IImageService";
import {imageModel} from "../../db/image.db";

export class ImageService implements IImageService {
    ls ?: LikeService;
    constructor (ls ?: LikeService) {
        this.ls = ls;
    }

    async addImage(filename: string, url: string, userId : string = "defaultUser"): Promise<Image> {
        return await imageModel.create({
            imageId: Date.now(), 
            userId: userId,  
            filename: filename, 
            url: url,
            uploadDate: new Date(),
        });
    }

    async getImages(sortField: string = 'filename', sortOrder: string = 'asc'): Promise<Image[]> {
        return await imageModel.find();
    }
    

    async deleteImage(id: number): Promise<boolean> {
        await imageModel.deleteOne({id: id});
        const result: boolean | null = await imageModel.findById({id: id});
        if (!result){
            if (result === null){
                alert("Image could not be deleted");
                return false;
            }
            alert("Image not found");
            return false;
        };
        return true;
    }    
}
