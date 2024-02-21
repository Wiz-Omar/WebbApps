export interface ILikeService {
   
    isImagedLiked(imageId : string, userId: string) : Promise<Boolean>
   
    likeImage(imageId: string, userId: string) : Promise<void>
   
    unlikeImage(imageId: string, userId: string): Promise<void>

    getLikedImages(userId: string): Promise<string[]>
   
}