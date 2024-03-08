import e from "express";
import { ImageExistsError, ImageNotFoundError } from "../errors/imageErrors";
import {
  InvalidIdError,
  LikeExistsError,
  LikeNotFoundError,
} from "../service/likeService";

//TODO: this can probably be split into several functions.

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
  //TODO: work on this more, there are more error types to handle!
  let status = 500; // Default to internal server error
  let message = "Something went wrong"; // Default message

  if (err instanceof LikeExistsError) {
    status = 409;
    message = "This image has already been liked by the user.";
  } else if (err instanceof ImageNotFoundError) {
    status = 404;
    message = "The requested image could not be found.";
  } else if (err instanceof LikeNotFoundError) {
    status = 404;
    message = "The requested like could not be found.";
  } else if (err instanceof InvalidIdError) {
    status = 400;
    message = "The provided image ID is invalid.";
  }
  // Could add more else if blocks for other custom error types
  return { status, message };
}

export { determineErrorResponse };
