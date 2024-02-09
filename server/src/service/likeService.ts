import { Image } from "../model/image";

export class LikeService {
    private likes: Set<string>; // Set of image IDs that the user has liked

    constructor() {
        this.likes = new Set<string>();
    }

    async likeImage(imageId: string): Promise<void> {
        this.likes.add(imageId);
    }

    async unlikeImage(imageId: string): Promise<void> {
        this.likes.delete(imageId);
    }

    //TODO: is this necessary?
    async getLikedImages(): Promise<string[]> {
        return Array.from(this.likes);
    }
}
