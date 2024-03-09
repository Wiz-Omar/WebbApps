//TODO: where does this belong?
export class InvalidIdError extends Error {
  constructor(imageId: string) {
    super(`Invalid image ID: ${imageId}`);
    this.name = "InvalidImageID";
  }
}

export class LikeExistsError extends Error {
  constructor(imageId: string) {
    super(`Like already exists for image with id ${imageId}`);
    this.name = "LikeExistsError";
  }
}

export class LikeNotFoundError extends Error {
  constructor(imageId: string) {
    super(`Like not found for image with id ${imageId}`);
    this.name = "LikeNotFoundError";
  }
}
