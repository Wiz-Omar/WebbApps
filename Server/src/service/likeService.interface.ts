/**
 * Interface for the like service. It is responsible for adding, getting and deleting likes from the database.
 */
export interface ILikeService {
   
    /**
     * Checks if an image is liked by a user.
     * @param imageId The ID of the image to check. Type: string
     * @param username The username of the user to check. Type: string
     * @returns {Promise<Boolean>} A promise that resolves to a boolean indicating if the image is liked.
     */
    isImageLiked(imageId : string, username: string) : Promise<Boolean>
   
    /**
     * Likes an image. Adds a like to the database.
     * @param imageId The ID of the image to like. Type: string
     * @param username The username of the user who likes the image. Type: string
     * @returns {Promise<void>} A promise that resolves when the image has been liked.
     */
    likeImage(imageId: string, username: string) : Promise<void>
   
    /**
     * Unlikes an image. Deletes the like from the database.
     * @param imageId The ID of the image to unlike. Type: string
     * @param username The username of the user who unlikes the image. Type: string
     * @returns {Promise<void>} A promise that resolves when the image has been unliked.
     */
    unlikeImage(imageId: string, username: string): Promise<void>

    /**
     * Retrieves a list of liked imageIds for a given user.
     * @param username The username of the user who owns the images. Type: string
     * @returns {Promise<string[]>} A promise that resolves to an array of image IDs that the user has liked.
     */
    getLikedImages(username: string): Promise<string[]>
   
}