import express, { NextFunction, Request, Response } from "express";
import { ImageExistsError, ImageService } from "../service/imageService";
import { IImageService } from "../service/imageService.interface";
import { Image } from "../model/image";

import multer from "multer";
import {
  MAX_FILENAME_LENGTH,
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
} from "./requests";
import { determineErrorResponse } from "./errorHandler";
import { next } from "cheerio/lib/api/traversing";
import { ErrorMessages, SuccessMessages } from "./responseMessages";

export const imageRouter = express.Router();

const imageService: IImageService = new ImageService();

// Multer middleware for file upload
const upload = multer();

// Use authentication middleware for all routes in this router
imageRouter.use(ensureAuthenticated);

// Centralized error handling middleware
imageRouter.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Determine the type of error and set response status and message accordingly
    const { status, message } = determineErrorResponse(err);
    res.status(status).send({ error: message });
  }
);

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

imageRouter.post(
  "/",
  upload.single("file"),
  fileUploadValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
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

imageRouter.delete(
  "/:imageId",
  ensureAuthenticated,
  validateImageId,
  async (req: DeleteImageRequest, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId;
      await imageService.deleteImage(imageId, req.session.username!);
      res.status(200).send({message: SuccessMessages.ImageDeleted});
    } catch (e: any) {
      next(e);
    }
  }
);

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
        res.status(200).send({message: SuccessMessages.ImageRenamed});
      } else {
        res.status(404).send({message: ErrorMessages.ImageNotFound});
      }
    } catch (e: any) {
      next(e);
    }
  }
);
