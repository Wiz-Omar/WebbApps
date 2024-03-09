import { LikeExistsError, LikeNotFoundError } from "./likeService";
import { ILikeService } from "./likeService.interface";

export class MockLikeService implements ILikeService {
  // Simulate a storage for liked images
  private likedImages: { [key: string]: string[] } = {};

  async isImageLiked(imageId: string, username: string): Promise<boolean> {
    return this.likedImages[username]?.includes(imageId) ?? false;
  }

  async likeImage(imageId: string, username: string): Promise<void> {
    if (!this.likedImages[username]) {
      this.likedImages[username] = [];
    }
    if (!this.likedImages[username].includes(imageId)) {
      this.likedImages[username].push(imageId);
    } else {
      // Simulate the duplicate key error by throwing an error
      throw new LikeExistsError(imageId);
    }
  }

  async unlikeImage(imageId: string, username: string): Promise<void> {
    if (this.likedImages[username]?.includes(imageId)) {
      const index = this.likedImages[username].indexOf(imageId);
      this.likedImages[username].splice(index, 1);
    } else {
      // Simulate not finding the like to unlike by throwing an error
      throw new LikeNotFoundError(imageId);
    }
  }

  async getLikedImages(username: string): Promise<string[]> {
    return this.likedImages[username] ?? [];
  }
}
