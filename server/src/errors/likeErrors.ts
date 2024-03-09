/**
 * Error for when the like already exists in the database.
 * This error is thrown when a user tries to like an image that they have already liked.
 */
export class LikeExistsError extends Error {
  constructor(imageId: string) {
    super(`Like already exists for image with id ${imageId}`);
    this.name = "LikeExistsError";
  }
}

/**
 * Error for when the like is not found in the database.
 * This error is thrown when a user tries to unlike an image that they have not liked.
 */
export class LikeNotFoundError extends Error {
  constructor(imageId: string) {
    super(`Like not found for image with id ${imageId}`);
    this.name = "LikeNotFoundError";
  }
}
