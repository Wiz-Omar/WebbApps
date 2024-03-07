// Custom error classes for specific cases
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
  
  // Function for file validation using custom errors
  export const validateFile = (file: File | null) => {
    if (!file) {
      throw new FileMissingError();
    }
    // Check if the filename is less than 256 characters.
    if (file.name.length > 256) {
      throw new FilenameTooLongError();
    }
    // Check if the file type is JPEG, JPG, or PNG
    if (!file.type.match("image/jpeg") && !file.type.match("image/png") && !file.type.match("image/jpg")) {
      throw new UnsupportedFiletypeError();
    }
    // Check if the file size is greater than 10MB
    if (file.size > 10 * 1024 * 1024) {
      throw new FileSizeExceededError();
    }
  };
  