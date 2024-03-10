import { ImageNotFoundError, InvalidIdError } from "../errors/imageErrors";
import { LikeExistsError, LikeNotFoundError } from "../errors/likeErrors";
import { determineErrorResponse } from "./likeErrorHandler";
import { ErrorMessages } from "./responseMessages";

const ID = "123";

describe('determineErrorResponse', () => {
  it('returns 409 and LikeAlreadyExists message for LikeExistsError', () => {
    const error = new LikeExistsError(ID);
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(409);
    expect(response.message).toEqual(ErrorMessages.LikeAlreadyExists);
  });

  it('returns 404 and ImageNotFound message for ImageNotFoundError', () => {
    const error = new ImageNotFoundError(ID);
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(404);
    expect(response.message).toEqual(ErrorMessages.ImageNotFound);
  });

  it('returns 404 and LikeNotFound message for LikeNotFoundError', () => {
    const error = new LikeNotFoundError(ID);
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(404);
    expect(response.message).toEqual(ErrorMessages.LikeNotFound);
  });

  it('returns 400 and InvalidImageID message for InvalidIdError', () => {
    const error = new InvalidIdError(ID);
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(400);
    expect(response.message).toEqual(ErrorMessages.InvalidImageID);
  });

  it('returns 500 and a generic message for an unspecified error', () => {
    const error = new Error();
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(500);
    expect(response.message).toEqual("Something went wrong");
  });
});
