import { Image } from "../model/image";
export interface ILikeService {
   
    isImageLiked(imageId : string, username: string) : Promise<Boolean>
   
    likeImage(imageId: string, username: string) : Promise<void>
   
    unlikeImage(imageId: string, username: string): Promise<void>

    getLikedImages(username: string): Promise<string[]>
   
}