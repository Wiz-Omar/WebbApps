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

    private images: Image[] = [];

    async addImage(filename: string, data: string): Promise<Image> {
        return await imageModel.create({
            id: Date.now(), 
            filename: filename, 
            data: data,
            uploadDate: new Date()
        });
    }

    async getImages(sortField: string = 'uploadDate', sortOrder: string = 'desc'): Promise<Image[]> {
        // Convert sortOrder to a number for MongoDB sorting
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        
        //TODO: look into .limit(). Seems to crash with more than 6 images right now. 
        try {
            // Use the sortField and sortDirection in the sort() method
            const images = await imageModel.find()
                                           .sort({ [sortField]: sortDirection })
                                           .limit(6)
                                           
            // convert the images to an array of Image objects
            return images.map((image) => {
                return {
                    id: image.id,
                    filename: image.filename,
                    data: image.data,
                    uploadDate: image.uploadDate
                };
            });
        } catch (error) {
            console.error("Error fetching images:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
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

    async getImageBySearch(search: string): Promise<Image[]> {
        try {
            const images = await imageModel.find({ filename: { $regex: search, $options: 'i' } });
            return images.map((image) => {
                return {
                    id: image.id,
                    filename: image.filename,
                    data: image.data,
                    uploadDate: image.uploadDate
                };
            });
        } catch (error) {
            console.error("Error fetching images:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
}
