import express, { NextFunction, Request, Response } from "express";
import { ImageExistsError, ImageService } from "../service/imageService";
import { IImageService } from "../service/imageService.interface";
import { Image } from "../model/image";

import multer from "multer";
import { ensureAuthenticated, validateImageId, validateSorting } from "./validators";
import { DeleteImageRequest, GetImagesRequest, SearchImageRequest } from "./requests";
import { determineErrorResponse } from "./errorHandler";
import { next } from "cheerio/lib/api/traversing";

const imageService: IImageService = new ImageService();

export const imageRouter = express.Router();

const upload = multer();

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
const MAX_FILENAME_LENGTH = 255;

// Use authentication middleware for all routes in this router
imageRouter.use(ensureAuthenticated);

// Centralized error handling middleware
imageRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Determine the type of error and set response status and message accordingly
  const { status, message } = determineErrorResponse(err);
  res.status(status).send({ error: message });
});

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

//TODO: could use middleware to validate the file type and size
imageRouter.post("/", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  // Check if the file size is less than 10MB
  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(413).send("File size exceeds limit of 10MB.");
  }
  // Check if the file type is JPEG, JPG or PNG
  if (!["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)) {
    return res
      .status(415)
      .send("Invalid file type, only JPEG and PNG are allowed!");
  }
  try {
    const base64Data = req.file.buffer.toString("base64");
    const filename = req.file.originalname;

    // Check if filename is provided
    if (typeof filename !== "string") {
      return res.status(400).send("Invalid input data for filename or url");
    }

    // Check that the filename is shorter than 256 characters
    if (filename.length > MAX_FILENAME_LENGTH) {
      return res.status(400).send("Filename too long");
    }
    //TODO: add check case for if name is ok. length, special characters etc
    const result = await imageService.addImage(
      filename,
      base64Data,
      req.session.username!
    );
    res.status(201).json({ message: "Image uploaded successfully", result });
  } catch (e: any) {
    next(e);
  }
});

imageRouter.delete(
  "/:imageId", ensureAuthenticated, validateImageId,
  async (req: DeleteImageRequest, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId;
      await imageService.deleteImage(imageId, req.session.username!);
      res.status(200).send({ message: "Image successfully deleted" });
    } catch (e: any) {
      next(e);
    }
  }
);

imageRouter.get("/search", ensureAuthenticated, async (req: SearchImageRequest, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string;
    if (!search) {
      res.status(400).send("No search query provided");
      return;
    }
    const images = await imageService.getImageBySearch(
      search,
      req.session.username!
    );
    res.status(200).send(images);
  } catch (e: any) {
    next(e);
  }
});

//TODO: create interface for the request body!!!
imageRouter.patch(
  "/:imageId",
  ensureAuthenticated,
  validateImageId,
  async (
    req: Request<{ imageId: string }, any, { newFilename: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const imageId = req.params.imageId;
      const newFilename = req.body.newFilename;
      const username = req.session.username!;

      // Check if newFilename is provided
      if (!newFilename || typeof newFilename !== "string") {
        res.status(400).send("Invalid new filename");
        return;
      }

      // Check that the newFilename is short than 256 characters
      if (newFilename.length > MAX_FILENAME_LENGTH) {
        res.status(400).send("Filename too long");
        return;
      }
      
      // Call the image service to change the image name
      const success = await imageService.changeImageName(
        imageId,
        newFilename,
        username
      );

      if (success) {
        res.status(200).send("Image name changed successfully");
      } else {
        res.status(404).send("Image not found");
      }
    } catch (e: any) {
      next(e);
    }
  }
);
