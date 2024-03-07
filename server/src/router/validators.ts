import { Request, Response, NextFunction } from "express";
import { validSortFields, validSortOrders } from "../model/sorting";
import exp from "constants";
import { ErrorMessages } from "./responseMessages";

export const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
export const MAX_FILENAME_LENGTH = 255;

// Middleware to ensure that the user is authenticated
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

// ImageRouter specific middleware
// Middleware to validate the imageId parameter
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

// ImageRouter specific middleware
// Middleware to validate the sorting query parameters
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

export const validateNewImageName = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const filename = req.body.newFilename as string;
  if (!filename || typeof filename !== "string") {
    res.status(400).send(ErrorMessages.InvalidFilename);
    return;
  }
  if (filename.length > MAX_FILENAME_LENGTH) {
    res.status(400).send(ErrorMessages.FilenameTooLong);
    return;
  }
  next();
};

// File validation middleware
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