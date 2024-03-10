import {
  InvalidCredentialsError,
  UserExistsError,
  UserNotFoundError,
} from "../errors/userErrors";
import { ErrorMessages } from "./responseMessages";

/**
 * Determines the appropriate HTTP response for a given error.
 *
 * @param {Error} err - The error thrown during request processing.
 * @returns {Object} An object containing the appropriate status code and message.
 *
 */
export function determineUserErrorResponse(err: Error): {
  status: number;
  message: string;
} {
  let status = 500; // Default to internal server error
  let message = "Something went wrong"; // Default message

  if (err.name === "UserExistsError" || err instanceof UserExistsError) {
    status = 409;
    message = ErrorMessages.UserAlreadyExists;
  } else if (
    err.name === "InvalidCredentialsError" ||
    err instanceof InvalidCredentialsError
  ) {
    status = 401;
    message = ErrorMessages.InvalidCredentials;
  } else if (
    err.name === "UserNotFoundError" ||
    err instanceof UserNotFoundError
  ) {
    status = 404;
    message = ErrorMessages.UserNotFound;
  }
  // Could add more else if blocks for other custom error types
  return { status, message };
}

export { determineUserErrorResponse as determineErrorResponse };
