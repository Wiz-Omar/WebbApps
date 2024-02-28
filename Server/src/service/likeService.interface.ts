import { Image } from "../model/image";
export interface ILikeService {
   
    isImageLiked(imageId : string, userId: string) : Promise<Boolean>
   
    likeImage(imageId: string, userId: string) : Promise<void>
   
    unlikeImage(imageId: string, userId: string): Promise<void>

    getLikedImages(userId: string): Promise<Image[]>
   
}