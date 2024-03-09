import { ImageExistsError, ImageNotFoundError } from "../errors/imageErrors";
import { LikeExistsError } from "../errors/likeErrors";
import {  } from "../service/likeService";

/**
 * Determines the appropriate HTTP response for a given error.
 * 
 * @param {Error} err - The error thrown during request processing.
 * @returns {Object} An object containing the appropriate status code and message.
 */
function determineErrorResponse(err: Error): { status: number; message: string } {

  let status = 500; // Default to internal server error
  let message = "Something went wrong"; // Default message

  if (err instanceof ImageNotFoundError) {
    status = 404;
    message = "The requested image could not be found.";
  } else if (err instanceof ImageExistsError) {
    status = 409;
    message = "An image with the same identifier already exists.";
  } else if (err instanceof LikeExistsError) {
    status = 409;
    message = "This image has already been liked by the user.";
  } 
  // Could add more else if blocks for other custom error types
  return { status, message };
}

export { determineErrorResponse };
