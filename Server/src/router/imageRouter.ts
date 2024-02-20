import express, { Request, Response } from "express";
import { ImageService } from "../service/imageService";
import { Image } from "../model/image";
import { validSortOrders, validSortFields } from "../model/sorting";
import { likeService } from "./likeRouter";
import { IImageService } from "../service/IImageService";

const imageService: IImageService = new ImageService(likeService);

export const imageRouter = express.Router();

imageRouter.get("/", async (req: Request, res: Response) => {
  try {

    let sortField = req.query.sortField as string | undefined;
    let sortOrder = req.query.sortOrder as string | undefined;

    // Validate sortField
    if (sortField && !validSortFields.includes(sortField)) {
        res.status(400).send("Invalid sort field. Valid options are 'filename' or 'uploadDate'.");
        return;
    }

    // Validate sortOrder
    if (sortOrder && !validSortOrders.includes(sortOrder)) {
        res.status(400).send("Invalid sort order. Valid options are 'asc' or 'desc'.");
        return;
    }

    const images = await imageService.getImages(
      sortField,
      sortOrder
    );
    res.status(200).send(images);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

imageRouter.post(
  "/",
  async (
    req: Request<{}, {}, { filename: string; url: string }>,
    res: Response
  ) => {
    try {
      const { filename, url } = req.body;
      if (typeof filename !== "string" || typeof url !== "string") {
        res.status(400).send("Invalid input data for filename or url");
        return;
      }
      const newImage = await imageService.addImage(filename, url);
      res.status(201).send(newImage);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }
);

imageRouter.delete(
  "/:id",
  async (req: Request<{ id: string }, {}, {}>, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id < 0) {
        res.status(400).send("Invalid image ID");
        return;
      }
      const deletionSuccess = await imageService.deleteImage(id);
      if (!deletionSuccess) {
        res.status(404).send("Image not found or could not be deleted");
        return;
      }
      res.status(200).send({ message: "Image successfully deleted" });
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }
);
