import { Image } from "../model/image";

export interface IImageService {
   
    addImage(filename: string, data: string, username: string) : Promise<Image>
   
    getImages(sortField: string | undefined, sortOrder: string | undefined, username: string, onlyLiked: boolean | undefined) : Promise<Image[]>
   
    deleteImage(imageId : string, username: string): Promise<boolean>

    //TODO: should be overloaded method instead?
    getImageBySearch(search: string, username: string): Promise<Image[]>
   
}
   
   