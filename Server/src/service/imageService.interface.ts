import { Image } from "../model/image";

export interface IImageService {
   
    addImage(filename: string, data: string, username: string) : Promise<Image>
   
    getImages(sortField: string | undefined, sortOrder: string | undefined, username: string, onlyLiked: boolean | undefined) : Promise<Image[]>
   
    deleteImage(imageId : string, username: string): Promise<boolean>

    getImageBySearch(search: string, username: string): Promise<Image[]>
 
    changeImageName(imageId: string, newFilename: string, username: string): Promise<boolean> 
}
   
   