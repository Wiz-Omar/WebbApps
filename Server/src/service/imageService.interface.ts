import { Image } from "../model/image";
import { Sorting } from "../model/sorting";

/**
 * Interface for the image service.
 * It is responsible for adding, getting and deleting images. Also handles renaming images and searching for images.
 * Delegates file operations to the path service and database operations to the database image service.
 */
export interface IImageService {
   
    /**
     * Adds a new image with the given filename and data.
     * @param filename The name of the image file. Type: string
     * @param data The base64 encoded image data. Type: string
     * @param username The username of the user who owns the image. Type: string
     */
    addImage(filename: string, data: string, username: string) : Promise<Image>
   
    /**
     * Retrieves a list of images for a given user, by optional filters.
     * @param sort The sorting options for the images. Type: Sorting
     * @param username The username of the user who owns the images. Type: string
     * @param onlyLiked The flag to indicate if only liked images should be returned. Type: boolean
     */
    getImages(sort: Sorting | undefined, username: string, onlyLiked: boolean | undefined) : Promise<Image[]>
   
    /**
     * Deletes a users image.
     * @param imageId The ID of the image to delete. Type: string
     * @param username The username of the user who owns the image. Type: string
     */
    deleteImage(imageId : string, username: string): Promise<boolean>

    /**
     * Retrieves images based on matching search query.
     * @param search The search query to match images by. Type: string
     * @param username The username of the user who owns the image. Type: string
     */
    getImageBySearch(search: string, username: string): Promise<Image[]>
 
    /**
     * Renames an image in the database.
     * @param imageId The ID of the image to rename. Type: string
     * @param newFilename The new name for the image file. Type: string
     * @param username The username of the user who owns the image. Type: string
     */
    changeImageName(imageId: string, newFilename: string, username: string): Promise<boolean> 
}
   
   