import express, { NextFunction, Request, Response } from "express";
import { LikeService } from "../service/likeService";
import { ILikeService } from "../service/likeService.interface";

import { ensureAuthenticated, validateImageId } from "./validators";
import { AllLikedImagesRequest, ImageLikeRequest } from "./likeRequests";
import { determineErrorResponse } from "./likeErrorHandler";

export const likeService: ILikeService = new LikeService();
export const likeRouter = express.Router();

likeRouter.use(ensureAuthenticated);

/**
 * POST /like/:imageId
 * Likes an image.
 *
 * Request Parameters:
 * - imageId (string): ID of the image to like.
 *
 * Responses:
 * - 200: Image liked successfully.
 * - 401: Unauthorized if the user is not logged in.
 * - 404: Image not found.
 * - 409: Conflict. The image has already been liked by the user.
 * - 500: Internal server error. Failed to like the image.
 * -
 */
likeRouter.post(
  "/:imageId",
  validateImageId,
  async (req: ImageLikeRequest, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId;
      // Safe to call ! here because of the ensureAuthenticated middleware
      await likeService.likeImage(imageId, req.session.username!);
      res.status(200).send("Image liked successfully");
      return;
    } catch (error: any) {
      next(error);
    }
  }
);

/**
 * DELETE /like/:imageId
 * Unlikes an image.
 *
 * Request Parameters:
 * - imageId (string): ID of the image to unlike.
 *
 * Responses:
 * - 200: Image unliked successfully.
 * - 401: Unauthorized if the user is not logged in.
 * - 404: Image not found.
 * - 500: Internal server error. Failed to unlike the image.
 */
likeRouter.delete(
  "/:imageId",
  validateImageId,
  async (req: ImageLikeRequest, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId;
      if (req.session.username === undefined) {
        res.status(401).send("Unauthorized action. User not logged in");
        return;
      }
      await likeService.unlikeImage(imageId, req.session.username);
      res.status(200).send("Image unliked successfully");
      return;
    } catch (error: any) {
      next(error);
    }
  }
);

/**
 * GET /like/:imageId
 * Checks if an image is liked by the user.
 *
 * Request Parameters:
 * - imageId (string): ID of the image to check.
 *
 * Responses:
 * - 200: Returns a boolean indicating whether the image is liked by the user.
 * - 401: Unauthorized if the user is not logged in.
 * - 404: Image not found.
 * - 500: Internal server error. Failed to check if the image is liked.
 *
 */
likeRouter.get(
  "/:imageId",
  validateImageId,
  async (req: ImageLikeRequest, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId;
      const liked: Boolean = await likeService.isImageLiked(
        imageId,
        req.session.username!
      );
      res.status(200).send({ liked });
    } catch (error: any) {
      next(error);
    }
  }
);

//TODO: remove? never used?
/**
 * GET /like
 * Gets all images liked by the user.
 *
 * Responses:
 * - 200: Returns an array of image IDs liked by the user.
 * - 401: Unauthorized if the user is not logged in.
 * - 500: Internal server error. Failed to retrieve liked images.
 *
 */
likeRouter.get("/", async (req: AllLikedImagesRequest, res: Response) => {
  try {
    if (req.session.username === undefined) {
      res.status(401).send("Unauthorized action. User not logged in");
      return;
    }
    const likedImages = await likeService.getLikedImages(req.session.username);
    res.status(200).send(likedImages);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// Centralized error handling middleware
// Should be placed after all other middleware and routes
likeRouter.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Determine the type of error and set response status and message accordingly
    const { status, message } = determineErrorResponse(err);
    res.status(status).send({ error: message });
  }
);
