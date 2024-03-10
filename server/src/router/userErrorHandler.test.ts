import { InvalidCredentialsError, UserExistsError, UserNotFoundError } from "../errors/userErrors";
import { ErrorMessages } from "./responseMessages";
import { determineUserErrorResponse } from "./userErrorHandler";

const USER = "user";

describe('determineUserErrorResponse', () => {
    it('returns 409 and a username already in use message for UserExistsError', () => {
      const error = new UserExistsError(USER);
      const response = determineUserErrorResponse(error);
      expect(response.status).toEqual(409);
      expect(response.message).toEqual(ErrorMessages.UserAlreadyExists);
    });
  
    it('returns 401 and an invalid credentials message for InvalidCredentialsError', () => {
      const error = new InvalidCredentialsError();
      const response = determineUserErrorResponse(error);
      expect(response.status).toEqual(401);
      expect(response.message).toEqual(ErrorMessages.InvalidCredentials);
    });
  
    it('returns 404 and a user not found message for UserNotFoundError', () => {
      const error = new UserNotFoundError(USER);
      const response = determineUserErrorResponse(error);
      expect(response.status).toEqual(404);
      expect(response.message).toEqual(ErrorMessages.UserNotFound);
    });
  
    it('returns 500 and a generic error message for an unspecified error', () => {
      const error = new Error();
      const response = determineUserErrorResponse(error);
      expect(response.status).toEqual(500);
      expect(response.message).toEqual("Something went wrong");
    });
  });
  