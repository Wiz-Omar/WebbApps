export class CustomFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FileMissingError extends CustomFileError {
  constructor() {
    super("File missing.");
  }
}

export class FilenameTooLongError extends CustomFileError {
  constructor() {
    super("Filename should be less than 256 characters.");
  }
}

export class UnsupportedFiletypeError extends CustomFileError {
  constructor() {
    super("Unsupported filetype. Supported filetypes are JPEG, JPG, and PNG.");
  }
}

export class FileSizeExceededError extends CustomFileError {
  constructor() {
    super("File size should be less than 10MB.");
  }
}
