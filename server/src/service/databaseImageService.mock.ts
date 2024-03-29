import { ImageExistsError, ImageNotFoundError } from "../errors/imageErrors";
import { Image } from "../model/image";
import { IDatabaseImageService } from "./databaseImageService.interface";

export class MockDatabaseImageService implements IDatabaseImageService {
  // Simulated storage for images, keyed by userId
  private storage: Record<string, Image[]> = {};

  async addImage(
    userId: string,
    filename: string,
    filePath: string
  ): Promise<Image> {
    // Initialize the user's image storage if it doesn't already exist
    if (!this.storage[userId]) {
      this.storage[userId] = [];
    }

    // Check if the image already exists for the user
    const imageExists = this.storage[userId].some(
      (image) => image.filename === filename
    );
    if (imageExists) {
      // Throw a specific error if the image is found
      throw new ImageExistsError(filename);
    }

    // Create a new image object with a pseudo-random ID and provided details
    const newImage: Image = {
      id: Math.random().toString(36).substr(2, 9), // More realistic pseudo-random ID
      filename,
      path: filePath,
      uploadDate: new Date(),
    };

    // Add the new image to the user's storage
    this.storage[userId].push(newImage);

    // Return the newly added image
    return newImage;
  }

  async getImages(
    userId: string,
    sortOptions: any = {},
    likedImageIds: string[]
  ): Promise<Image[]> {
    const userImages = this.storage[userId] || [];
    return userImages;
  }

  async deleteImage(imageId: string): Promise<boolean> {
    for (const userId in this.storage) {
      const index = this.storage[userId].findIndex(
        (image) => image.id === imageId
      );
      if (index > -1) {
        this.storage[userId].splice(index, 1);
        return true;
      }
    }
    return false; // Image not found
  }

  async findImageById(imageId: string): Promise<Image> {
    for (const userId in this.storage) {
      const image = this.storage[userId].find((image) => image.id === imageId);
      if (image) {
        return image;
      }
    }
    throw new ImageNotFoundError(imageId); // Simulate behavior when an image is not found
  }

  async getImageBySearch(userId: string, search: string): Promise<Image[]> {
    const userImages = this.storage[userId] || [];
    const searchResults = userImages.filter((image) =>
      image.filename.includes(search)
    );
    return searchResults;
  }

  async renameImage(
    imageId: string,
    newFilename: string,
    newFilepath: string
  ): Promise<boolean> {
    for (const userId in this.storage) {
      const image = this.storage[userId].find((image) => image.id === imageId);
      if (image) {
        image.filename = newFilename;
        image.path = newFilepath;
        return true;
      }
    }
    throw new ImageNotFoundError(imageId);
  }
}
