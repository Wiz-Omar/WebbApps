import { Image } from "../model/image";

export interface IDatabaseImageService {
  addImage(userId: string, filename: string, filePath: string): Promise<Image>;
  getImages(userId: string, query: any, sortOptions: any): Promise<Image[]>;
  deleteImage(imageId: string): Promise<boolean>;
  findImageById(imageId: string): Promise<Image>;
  getImageBySearch(userId: string, search: string): Promise<Image[]>;
}