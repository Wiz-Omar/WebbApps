import { Image } from "../model/image";

export interface IImageService {
   
    addImage(filename: string, url: string, userId: string) : Promise<Image>
   
    getImages(sortField: string | undefined, sortOrder: string | undefined, userId: string) : Promise<Image[]>
   
    deleteImage(imageId : string, userId: string): Promise<boolean>
   
}
   
   