import { Image } from "../model/image";
import { Sorting } from "../model/sorting";

export interface IImageService {
   
    addImage(filename: string, data: string, username: string) : Promise<Image>
   
    getImages(sort: Sorting | undefined, username: string, onlyLiked: boolean | undefined) : Promise<Image[]>
   
    deleteImage(imageId : string, username: string): Promise<boolean>

    getImageBySearch(search: string, username: string): Promise<Image[]>
 
    changeImageName(imageId: string, newFilename: string, username: string): Promise<boolean> 
}
   
   