import { Image } from "../model/image";

export class ImageService {
    private images: Image[] = [];

    async addImage(filename: string, url: string): Promise<Image> {
        const image: Image = {
            id: Date.now(), // Simple ID generation
            filename: filename,
            url: url,
            uploadDate: new Date()
        };
        this.images.push(image);
        return { ...image };
    }

    async getImages(): Promise<Image[]> {
        return JSON.parse(JSON.stringify(this.images));
    }

    async deleteImage(id: number): Promise<boolean> {
        const index = this.images.findIndex(image => image.id === id);
        if (index === -1) {
            return false; // Image not found
        }
        this.images.splice(index, 1);
        return true; // Deletion successful
    }    
}
