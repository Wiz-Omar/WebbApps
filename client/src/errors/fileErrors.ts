// Custom error classes for File upload
export class FileMissingError extends Error {
  constructor() {
    super("File missing.");
    this.name = "FileMissingError";
  }
}

export class FilenameTooLongError extends Error {
  constructor() {
    super("Filename should be less than 256 characters.");
    this.name = "FilenameTooLongError";
  }
}

export class UnsupportedFiletypeError extends Error {
  constructor() {
    super("Unsupported filetype. Supported filetypes are JPEG, JPG and PNG.");
    this.name = "UnsupportedFiletypeError";
  }
}

export class FileSizeExceededError extends Error {
  constructor() {
    super("File size should be less than 10MB.");
    this.name = "FileSizeExceededError";
  }
}
