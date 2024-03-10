import { ImageExistsError, ImageNotFoundError } from "../errors/imageErrors";
import { LikeExistsError } from "../errors/likeErrors";
import { determineErrorResponse } from "./imageErrorHandler";
import { ErrorMessages } from "./responseMessages";


describe('determineErrorResponse', () => {
  it('returns 404 for ImageNotFoundError', () => {
    const error: ImageNotFoundError = new ImageNotFoundError("123");
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(404);
    expect(response.message).toEqual(ErrorMessages.ImageNotFound);
  });

  it('returns 409 for ImageExistsError', () => {
    const error: ImageExistsError = new ImageExistsError("123");
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(409);
    expect(response.message).toEqual(ErrorMessages.ImageAlreadyExists);
  });

  it('returns 409 for LikeExistsError', () => {
    const error: LikeExistsError = new LikeExistsError("123");
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(409);
    expect(response.message).toEqual(ErrorMessages.LikeAlreadyExists);
  });

  it('returns 500 for generic Error', () => {
    const error: Error = new Error();
    const response = determineErrorResponse(error);
    expect(response.status).toEqual(500);
    expect(response.message).toEqual(ErrorMessages.GenericError);
  });
});
