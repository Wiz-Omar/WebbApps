import { Image } from "../model/image";

export interface IImageService {
   
    addImage(filename: string, url: string) : Promise<Image>
   
    getImages(sortField: string, sortOrder: string) : Promise<Image[]>
   
    deleteImage(id : number): Promise<boolean>
   
}
   
   