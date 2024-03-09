export class ImageNotFoundError extends Error {
  constructor(imageId: string) {
    super(`Image with id ${imageId} not found`);
    this.name = "ImageNotFoundError";
  }
}

export class ImageExistsError extends Error {
  constructor(filename: string) {
    super(`Image with id ${filename} already exists`);
    this.name = "ImageExistsError";
  }
}

export class FileOperationError extends Error {
  constructor() {
    super(`Error saving the file`);
    this.name = "FileSaveError";
  }
}
