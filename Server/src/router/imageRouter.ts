import express, { Request, Response } from "express";
import { ImageExistsError, ImageService } from "../service/imageService";
import { Image } from "../model/image";
import { validSortOrders, validSortFields } from "../model/sorting";
import { IImageService } from "../service/imageService.interface";


import multer from "multer";
import { ensureAuthenticated, validateImageId, validateSorting } from "./validators";
import { DeleteImageRequest, GetImagesRequest, SearchImageRequest } from "./requests";

const imageService: IImageService = new ImageService();

export const imageRouter = express.Router();

const upload = multer();

// Use authentication middleware for all routes in this router
imageRouter.use(ensureAuthenticated);

imageRouter.get(
  "/",
  validateSorting,
  async (req: GetImagesRequest, res: Response) => {
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
      console.error("Error getting images" + e);
      if (e.name === "ImageNotFoundError") {
        res.status(404).send(e.message);
      } else {
        res.status(500).send(e.message);
      }
    }
  }
);

//TODO: could use middleware to validate the file type and size
imageRouter.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  // Check if the file size is less than 10MB
  if (req.file.size > 1024 * 1024 * 10) {
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
    if (filename.length > 255) {
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
    if (e instanceof ImageExistsError) {
      // If the image already exists, send a 409 conflict response
      res.status(409).send(e.message);
    } else {
      // If something else went wrong, send a 500 internal server error response
      console.error("Error adding image: " + e);
      res.status(500).send(e.message);
    }
  }
});

imageRouter.delete(
  "/:imageId", ensureAuthenticated,
  async (req: DeleteImageRequest, res: Response) => {
    try {
      const imageId = req.params.imageId;
      if (
        typeof imageId !== "string" ||
        imageId === "" /*|| imageId.length !== 24 ??*/
      ) {
        res.status(400).send("Invalid image ID");
        return;
      }
      await imageService.deleteImage(imageId, req.session.username!);
      res.status(200).send({ message: "Image successfully deleted" });
    } catch (e: any) {
      console.error("Error deleting image in imageRouer" + e);
      res.status(500).send(e.message);
    }
  }
);

imageRouter.get("/search", ensureAuthenticated, async (req: SearchImageRequest, res: Response) => {
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
    res.status(500).send(e.message);
  }
});

imageRouter.patch(
  "/:imageId",
  ensureAuthenticated,
  validateImageId,
  async (
    req: Request<{ imageId: string }, any, { newFilename: string }>,
    res: Response
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
      if (newFilename.length > 255) {
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
    } catch (error) {
      console.error("Error changing image name:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
