import { MAX_FILENAME_LENGTH, MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from "../constants/validation";
import {
  FileMissingError,
  FileSizeExceededError,
  FilenameTooLongError,
  UnsupportedFiletypeError,
} from "../errors/fileErrors";

/**
 * Validates a file to ensure it meets the requirements. Ues custom error classes for specific cases.
 * @param file The file to validate.
 */
export const validateFile = (file: File | null) => {
  if (!file) {
    throw new FileMissingError();
  }
  // Check if the filename is less than MAX_FILENAME_LENGTH characters.
  if (file.name.length > MAX_FILENAME_LENGTH) {
    throw new FilenameTooLongError();
  }
  // Check if the file type is supported
  const isSupportedFileType = SUPPORTED_FILE_TYPES.some((type) =>
    file.type.match(type)
  );
  if (!isSupportedFileType) {
    throw new UnsupportedFiletypeError();
  }
  // Check if the file size is less than MAX_FILE_SIZE
  if (file.size > MAX_FILE_SIZE) {
    throw new FileSizeExceededError();
  }
};
