import { Request, Response, NextFunction } from "express";
import { validSortFields, validSortOrders } from "../model/sorting";
import exp from "constants";
import { ErrorMessages } from "./responseMessages";

export const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
export const MAX_FILENAME_LENGTH = 255; // 255 characters

/**
 * Middleware function to ensure that the user is authenticated.
 * If the user is not authenticated, it sends a 401 Unauthorized response.
 */
export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session || !req.session.username) {
    res.status(401).send(ErrorMessages.Unauthorized);
    return;
  }
  next();
};

/**
 * Middleware function to ensure that the provided imageId is valid format (non-empty string).
 * If the imageId is invalid, it sends a 400 Bad Request response.
 */
export const validateImageId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { imageId } = req.params;

  // Check if imageId is a non-empty string
  if (!imageId || typeof imageId !== "string" || imageId.trim().length === 0) {
    res.status(400).send(ErrorMessages.InvalidImageID);
    return;
  }
  next();
};


// ImageRouter specific middleware(s):

/**
 * Middleware function to ensure that the provided sortField and sortOrder are valid.
 * If the sortField or sortOrder is invalid, it sends a 400 Bad Request response.
 */
export const validateSorting = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sortField = req.query.sortField as string;
  const sortOrder = req.query.sortOrder as string;

  if (sortField && !validSortFields.includes(sortField)) {
    res.status(400).send(ErrorMessages.InvalidSortField);
    return;
  }
  if (sortOrder && !validSortOrders.includes(sortOrder)) {
    res.status(400).send(ErrorMessages.InvalidSortOrder);
    return;
  }
  next();
};

/**
 * Middleware function to ensure that the provided limit and offset are valid.
 * If the search query is invalid (empty), it sends a 400 Bad Request response.
 */
export const validateSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const search = req.query.search as string;
  if (!search) {
    res.status(400).send(ErrorMessages.NoSearchQuery);
    return;
  }
  next();
};

/**
 * Middleware function to ensure that new file name is valid.
 * If the new file name is invalid, it sends a 400 Bad Request response.
 */
export const validateNewImageName = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const filename = req.body.newFilename as string;
  if (!filename || typeof filename !== "string" || filename === "") {
    res.status(400).send(ErrorMessages.InvalidFilename);
    return;
  }
  if (filename.length > MAX_FILENAME_LENGTH) {
    res.status(400).send(ErrorMessages.FilenameTooLong);
    return;
  }
  next();
};

/**
 * Middleware function to ensure that the file upload is valid.
 * If the file uploaded is too large, returns a 413 Payload Too Large response.
 * If the file uploaded is not a JPEG, JPG, or PNG, returns a 415 Unsupported Media Type response.
 * If the file uploaded does not have a valid original filename, returns a 400 Bad Request response.
 */
export const fileUploadValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  // Check if a file is present in the request
  if (!file) {
    return res.status(400).send(ErrorMessages.NoFileUploaded);
  }
  // Check if the file size is less than 10MB
  if (file.size > MAX_FILE_SIZE) {
    return res.status(413).send(ErrorMessages.FileSizeExceeds);
  }
  // Check if original filename is provided and validate it
  if (typeof file.originalname !== "string" || !file.originalname.trim()) {
    return res.status(400).send(ErrorMessages.InvalidFileData);
  }
  // Check that the original filename is shorter than 256 characters
  if (file.originalname.length > MAX_FILENAME_LENGTH) {
    return res.status(400).send(ErrorMessages.FilenameTooLong);
  }
  // Check if the file type is JPEG, JPG, or PNG
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
    return res.status(415).send(ErrorMessages.InvalidFileType);
  }
  next();
};

// Constants for validation criteria
const MIN_USERNAME_LENGTH = 8;
const MIN_PASSWORD_LENGTH = 8;
const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/; // Only alphanumeric characters allowed

/**
 * Middleware function to ensure that the user credentials are valid.
 * If the username or password is invalid, it sends a 400 Bad Request response.
 */
export function validateUserCredentials(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;
  const isUsernameValid = typeof username === "string" && username.length >= MIN_USERNAME_LENGTH && USERNAME_PATTERN.test(username);
  const isPasswordValid = typeof password === "string" && password.length >= MIN_PASSWORD_LENGTH;
  if (!isUsernameValid || !isPasswordValid) {
    return res.status(400).send("Invalid input data for username or password");
  }
  next();
}

