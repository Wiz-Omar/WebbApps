/**
 * Error for when the image is not found in the database.
 * This error is thrown when a user tries to get an image that does not exist.
 */
export class ImageNotFoundError extends Error {
  constructor(imageId: string) {
    super(`Image with id ${imageId} not found`);
    this.name = "ImageNotFoundError";
  }
}

/**
 * Error for when the image already exists in the database.
 * This error is thrown when a user tries to upload an image with a filename that already exists.
 */
export class ImageExistsError extends Error {
  constructor(filename: string) {
    super(`Image with id ${filename} already exists`);
    this.name = "ImageExistsError";
  }
}

/**
 * Error for when the an file operation failed.
 * This error is thrown when a file operation fails, such as saving the file.
 */
export class FileOperationError extends Error {
  constructor() {
    super(`Error saving the file`);
    this.name = "FileSaveError";
  }
}

/**
 * Error for when the image ID is invalid.
 * This error is thrown when a user tries to get an image with an invalid ID.
 */
export class InvalidIdError extends Error {
  constructor(imageId: string) {
    super(`Invalid image ID: ${imageId}`);
    this.name = "InvalidImageID";
  }
}
