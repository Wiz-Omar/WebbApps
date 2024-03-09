import e from "express";
import { ImageExistsError, ImageNotFoundError, InvalidIdError } from "../errors/imageErrors";
import {
  LikeExistsError,
  LikeNotFoundError,
} from "../errors/likeErrors";
import { ErrorMessages } from "./responseMessages";

/**
 * Determines the appropriate HTTP response for a given error.
 *
 * @param {Error} err - The error thrown during request processing.
 * @returns {Object} An object containing the appropriate status code and message.
 *
 */
function determineErrorResponse(err: Error): {
  status: number;
  message: string;
} {

  let status = 500; // Default to internal server error
  let message = "Something went wrong"; // Default message

  if (err instanceof LikeExistsError) {
    status = 409;
    message = ErrorMessages.LikeAlreadyExists;
  } else if (err instanceof ImageNotFoundError) {
    status = 404;
    message = ErrorMessages.ImageNotFound;
  } else if (err instanceof LikeNotFoundError) {
    status = 404;
    message = ErrorMessages.LikeNotFound;
  } else if (err instanceof InvalidIdError) {
    status = 400;
    message = ErrorMessages.InvalidImageID;
  }
  // Could add more else if blocks for other custom error types
  return { status, message };
}

export { determineErrorResponse };
