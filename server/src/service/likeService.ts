import { Image } from "../model/image";
import {ILikeService} from "./ILikeService"
import {likeImage} from "../../db/like.db";
import { imageModel } from "../../db/image.db";

export class LikeService implements ILikeService{
    private likes: Set<string>; // Set of image IDs that the user has liked

    constructor() {
        this.likes = new Set<string>();
    }

    async isImageLiked(imageId : string, userId: string): Promise<boolean> {
        //return 
        const img = await imageModel.findOne({
            imageId : imageId
        })
        if (! img) {
            return false;
        }
        const like = await likeImage.findOne({
            image: img._id, 
            userId: userId,  
        });
        return (like !== null);
    }

    async likeImage(imageId : string, userId: string): Promise<void> {
        await likeImage.create({
            imageId: imageId, 
            userId: userId,  
        });
        //this.likes.add(imageId);
    }

    async unlikeImage(imageId : string, userId: string): Promise<void> {
        this.likes.delete(imageId);
    }

    //TODO: is this necessary?
    async getLikedImages(userId: string): Promise<string[]> {
        return Array.from(this.likes);
    }
}
