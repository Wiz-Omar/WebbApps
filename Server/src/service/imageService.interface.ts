import { Image } from "../model/image";

export interface IImageService {
   
    addImage(filename: string, url: string, username: string) : Promise<Image>
   
    getImages(sortField: string | undefined, sortOrder: string | undefined, username: string) : Promise<Image[]>
   
    deleteImage(imageId : string, username: string): Promise<boolean>
   
}
   
   