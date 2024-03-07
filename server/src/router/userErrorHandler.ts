
import { InvalidCredentialsError, UserExistsError, UserNotFoundError } from "../errors/userErrors";

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

  // Check for userExistsError
  if (err.name === "UserExistsError" || err instanceof UserExistsError) {
    status = 409;
    message = "This username is already in use.";
  } else if (err.name === "InvalidCredentialsError" ||err instanceof InvalidCredentialsError) {
    status = 401;
    message = "The requested user could not be found.";
  } else if (err.name === "UserNotFoundError" || err instanceof UserNotFoundError) {
    status = 404;
    message = "The requested user could not be found.";
  }
  // Could add more else if blocks for other custom error types
  return { status, message };
}

export { determineErrorResponse };
