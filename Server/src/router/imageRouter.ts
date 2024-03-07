import express, { NextFunction, Request, Response } from "express";
import { ImageService } from "../service/imageService";
import { IImageService } from "../service/imageService.interface";

import multer from "multer";
import {
  ensureAuthenticated,
  fileUploadValidation,
  validateImageId,
  validateNewImageName,
  validateSearchQuery,
  validateSorting,
} from "./validators";
import {
  DeleteImageRequest,
  GetImagesRequest,
  PatchImageRequest,
  SearchImageRequest,
} from "./imageRequests";
import { determineErrorResponse } from "./errorHandler";
import { ErrorMessages, SuccessMessages } from "./responseMessages";

export const imageRouter = express.Router();

const imageService: IImageService = new ImageService();

// Multer middleware for file upload
const upload = multer();

// Use authentication middleware for all routes in this router
imageRouter.use(ensureAuthenticated);

/**
 * GET /images
 * Retrieves a list of images optionally filtered by like status.
 *
 * Request Query Parameters:
 * - sortField (string): Field to sort the images by (default: "uploadDate").
 * - sortOrder (string): Order of sorting, either "asc" or "desc" (default: "desc").
 * - onlyLiked (boolean): If true, only returns images liked by the user (default: false).
 *
 * Responses:
 * - 200: Successfully retrieved list of images. Returns an array of image objects.
 * - 401: Unauthorized if the user is not logged in.
 * - 400: Invalid sortField or sortOrder.
 * - 500: Internal server error. Failed to retrieve images.
 */
imageRouter.get(
  "/",
  validateSorting,
  async (req: GetImagesRequest, res: Response, next: NextFunction) => {
    let sortField = req.query.sortField as string | undefined;
    let sortOrder = req.query.sortOrder as string | undefined;
    let onlyLiked = req.query.onlyLiked === "true"; // Convert "onlyLiked" from string to boolean

    try {
      const images = await imageService.getImages(
        sortField,
        sortOrder,
        // safe to use ! here because we are using the ensureAuthenticated middleware
        req.session.username!,
        onlyLiked
      );
      res.status(200).send(images);
    } catch (e: any) {
      next(e);
    }
  }
);

/**
 * POST /images
 * Uploads a new image to the server.
 *
 * Request Body:
 * - file (file): Image file to upload.
 *
 * Responses:
 * - 201: Image uploaded successfully. Returns the uploaded image object.
 * - 400: Invalid file data or filename.
 * - 401: Unauthorized if the user is not logged in.
 * - 413: File size exceeds the limit.
 * - 415: Unsupported media type if the file type is not JPEG or PNG.
 * - 500: Internal server error. Image upload failed.
 */
imageRouter.post(
  "/",
  upload.single("file"),
  fileUploadValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // safe to run ! here because we are using the fileUploadValidation middleware
      const base64Data = req.file!.buffer.toString("base64");
      const filename = req.file!.originalname;

      // Call the image service to add the image
      const result = await imageService.addImage(
        filename,
        base64Data,
        req.session.username!
      );
      res.status(201).json({ message: SuccessMessages.ImageUploaded, result });
    } catch (e: any) {
      next(e);
    }
  }
);

/**
 * DELETE /images/:imageId
 * Deletes an image from the server.
 *
 * Request Parameters:
 * - imageId (string): ID of the image to delete.
 *
 * Responses:
 * - 200: Image deleted successfully.
 * - 401: Unauthorized if the user is not logged in.
 * - 404: Image not found.
 * - 500: Internal server error. ImageId was not found, or deletion failed.
 */
imageRouter.delete(
  "/:imageId",
  ensureAuthenticated,
  validateImageId,
  async (req: DeleteImageRequest, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId;
      await imageService.deleteImage(imageId, req.session.username!);
      res.status(200).send({ message: SuccessMessages.ImageDeleted });
    } catch (e: any) {
      next(e);
    }
  }
);

/**
 * GET /images/search
 * Searches for images by filename.
 *
 * Request Query Parameters:
 * - search (string): Search query to filter images by filename.
 *
 * Responses:
 * - 200: Successfully retrieved list of images matching the search query. Returns an array of image objects.
 * - 401: Unauthorized if the user is not logged in.
 * - 400: No search query provided.
 * - 500: Internal server error. Failed to retrieve images.
 */
imageRouter.get(
  "/search",
  ensureAuthenticated,
  validateSearchQuery,
  async (req: SearchImageRequest, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string;
      const images = await imageService.getImageBySearch(
        search,
        req.session.username!
      );
      res.status(200).send(images);
    } catch (e: any) {
      next(e);
    }
  }
);

/**
 * PATCH /images/:imageId
 * Changes the name of an image.
 *
 * Request Parameters:
 * - imageId (string): ID of the image to rename.
 *
 * Request Body:
 * - newFilename (string): New filename to assign to the image.
 *
 * Responses:
 * - 200: Image renamed successfully.
 * - 401: Unauthorized if the user is not logged in.
 * - 404: Image not found.
 * - 500: Internal server error. Failed to rename the image.
 */
imageRouter.patch(
  "/:imageId",
  ensureAuthenticated,
  validateImageId,
  validateNewImageName,
  async (req: PatchImageRequest, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId;
      const newFilename = req.body.newFilename;
      const username = req.session.username!;

      // Call the image service to change the image name
      const success = await imageService.changeImageName(
        imageId,
        newFilename,
        username
      );

      if (success) {
        res.status(200).send({ message: SuccessMessages.ImageRenamed });
      } else {
        res.status(404).send({ message: ErrorMessages.ImageNotFound });
      }
    } catch (e: any) {
      next(e);
    }
  }
);

// Centralized error handling middleware
// Should be placed after all other middleware and routes
imageRouter.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("Error handler was used!");
    // Determine the type of error and set response status and message accordingly
    const { status, message } = determineErrorResponse(err);
    res.status(status).send({ error: message });
  }
);