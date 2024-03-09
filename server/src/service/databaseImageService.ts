import { Model } from "mongoose";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { Image } from "../model/image";
import { imageModel } from "../db/image.db";
import { MappingService } from "./mappingService";
import { ObjectId } from "mongodb";
import { ImageNotFoundError } from "../errors/imageErrors";

interface ImageQuery {
  userId: string;
  _id?: {
    $in: ObjectId[];
  };
  filename?: {
    $regex: string;
    $options: string;
  };
}

export class DatabaseImageService implements IDatabaseImageService {

  /**
   * Retrieves the Image model from the database.
   * @returns {Promise<Model<Image>>} A promise that resolves to the Image model.
   */
  private async getImageModel(): Promise<Model<Image>> {
    return await imageModel;
  }

  /**
   * Adds a new image to the database with the given user ID, filename, and file path.
   *
   * Creates new image document in the database associated with a specific user.
   * After creation, the image document is mapped to the Image model using a mapping service
   * before being returned.
   *
   * @param {string} userId - The ID of the user who is adding the image.
   * @param {string} filename - The name of the file.
   * @param {string} filePath - The path where the file is stored.
   * @returns {Promise<Image>} A promise that resolves to the Image object after it has been added to the database.
   */
  async addImage(
    userId: string,
    filename: string,
    filePath: string
  ): Promise<Image> {
    const im: Model<Image> = await this.getImageModel();
    const databaseImage = await im.create({
      userId: userId,
      filename: filename,
      path: filePath,
      uploadDate: new Date(),
    });
    return MappingService.mapDatabaseImageToImage(databaseImage);
  }

  /**
   * Retrieves a list of images for a given user, by opitional filters.
   *
   * Fetches images associated with a specific user. It can optionally filter the results
   * to include only images that have been "liked" (specified by their IDs). The results can be sorted
   * based on provided sorting options.
   *
   * @param {string} userId - The ID of the user whose images are to be retrieved.
   * @param {any} sortOptions - Sorting criteria for the query results. Consider defining a more specific type.
   * @param {string[] | undefined} likedImageIds - An optional array of image IDs to filter the images by; only images with these IDs will be included.
   * @returns {Promise<Image[]>} A promise that resolves to an array of Image objects.
   */
  async getImages(
    userId: string,
    sortOptions: any, // Consider defining a type for this as well.
    likedImageIds: string[] | undefined
  ): Promise<Image[]> {
    const im: Model<Image> = await this.getImageModel();
    let query: ImageQuery = { userId };

    if (likedImageIds && likedImageIds.length > 0) {
      const objectIdList: ObjectId[] = likedImageIds.map(
        (id) => new ObjectId(id)
      );
      query._id = { $in: objectIdList };
    }

    const images = await im.find(query).sort(sortOptions).exec();
    return images.map(MappingService.mapDatabaseImageToImage);
  }

  /**
   * Deletes an image from the database.
   *
   * @param {string} imageId The unique identifier of the image to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the image was successfully deleted, or false if the image was not found.
   * @throws {ImageNotFoundError} When no image is found with the provided ID.
   *
   */
  async deleteImage(imageId: string): Promise<boolean> {
    const im: Model<Image> = await this.getImageModel();
    const query = { _id: new ObjectId(imageId) };
    const result = await im.deleteOne(query);
    return result.acknowledged && result.deletedCount === 1;
  }

  /**
   * Finds a single image by its ID.
   *
   * Tries to find an image document in the database using the provided image ID.
   * If no image is found matching the given ID, it throws an ImageNotFoundError.
   *
   * @param {string} imageId The unique identifier of the image to find.
   * @returns {Promise<Image>} A promise that resolves to the found Image object.
   * @throws {ImageNotFoundError} When no image is found with the provided ID.
   */
  async findImageById(imageId: string): Promise<Image> {
    const im: Model<Image> = await this.getImageModel();
    const query = { _id: new ObjectId(imageId) };
    const databaseImage = await im.findOne(query);
    if (databaseImage === null) {
      throw new ImageNotFoundError(`Image with ID ${imageId} not found`);
    }
    return MappingService.mapDatabaseImageToImage(databaseImage);
  }

  /**
   * Searches for images by user ID and filename search criteria.
   * Retrieves a list of images that belong to a specific user and match a filename search pattern.
   * The search pattern is case-insensitive and can match any part of the filename.
   *
   * @param {string} userId The ID of the user whose images are being searched.
   * @param {string} search The search string used to filter images by their filename.
   * @returns {Promise<Image[]>} A promise that resolves to an array of Image objects that match the search criteria.
   */
  async getImageBySearch(userId: string, search: string): Promise<Image[]> {
    const im: Model<Image> = await this.getImageModel();
    const query: ImageQuery = {
      userId,
      filename: { $regex: search, $options: "i" },
    };
    const images = await im.find(query);
    return images.map(MappingService.mapDatabaseImageToImage);
  }

  /**
   * Renames an image in the database.
   * 
   * Updates the filename and filepath of an image document in the database.
   * 
   * @param imageId The unique identifier of the image to rename
   * @param newFilename The new filename for the image
   * @param newFilepath The new filepath for the image
   * @returns 
   */
  async renameImage(
    imageId: string,
    newFilename: string,
    newFilepath: string
  ): Promise<boolean> {
    const im: Model<Image> = await this.getImageModel();
    // Find the image document to verify it exists before attempting an update
    const imageDocument = await im.findById(imageId);
    if (!imageDocument) {
      throw new ImageNotFoundError(`Image with ID ${imageId} not found`);
    }
    const updateResult = await im.updateOne(
      { _id: imageId },
      { $set: { filename: newFilename, path: newFilepath } }
    );
    // Check if the update operation was successful (i.e., at least one document was updated)
    return updateResult.matchedCount > 0;
  }
}
