import { Image } from "../model/image";

export interface IImageService {
   
    addImage(filename: string, url: string, userId: string | undefined) : Promise<Image>
   
    getImages(sortField: string | undefined, sortOrder: string | undefined) : Promise<Image[]>
   
    deleteImage(id : number): Promise<boolean>
   
}
   
   