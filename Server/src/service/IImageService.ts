import { Image } from "../model/image";

export interface IImageService {
   
    addImage(filename: string, url: string) : Promise<Image>
   
    getImages(sortField: string | undefined, sortOrder: string | undefined) : Promise<Image[]>
   
    deleteImage(id : number): Promise<boolean>

    //TODO: should be overloaded method instead?
    getImageBySearch(search: string): Promise<Image[]>
   
}
   
   