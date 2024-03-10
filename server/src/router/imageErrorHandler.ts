import { ImageExistsError, ImageNotFoundError } from "../errors/imageErrors";
import { LikeExistsError } from "../errors/likeErrors";
import {  } from "../service/likeService";
import { ErrorMessages } from "./responseMessages";

/**
 * Determines the appropriate HTTP response for a given error.
 * 
 * @param {Error} err - The error thrown during request processing.
 * @returns {Object} An object containing the appropriate status code and message.
 */
function determineImageErrorResponse(err: Error): { status: number; message: string } {

  let status = 500; // Default to internal server error
  let message = ErrorMessages.GenericError; // Default message

  if (err instanceof ImageNotFoundError) {
    status = 404;
    message = ErrorMessages.ImageNotFound;
  } else if (err instanceof ImageExistsError) {
    status = 409;
    message = ErrorMessages.ImageAlreadyExists;
  } else if (err instanceof LikeExistsError) {
    status = 409;
    message = ErrorMessages.LikeAlreadyExists;
  } 
  // Could add more else if blocks for other custom error types
  return { status, message };
}

export { determineImageErrorResponse as determineErrorResponse };
