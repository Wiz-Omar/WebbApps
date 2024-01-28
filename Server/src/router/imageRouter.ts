import express, { Request, Response } from "express";
import { ImageService } from "../service/imageService";

const imageService = new ImageService();

export const imageRouter = express.Router();

imageRouter.get("/", async (req: Request, res: Response) => {
    try {
        const images = await imageService.getImages();
        // will return an empty array if no images
        res.status(200).send(images);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

imageRouter.post("/", async (req: Request<{}, {}, { filename: string, url: string }>, res: Response) => {
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
});

imageRouter.delete("/:id", async (req: Request<{ id: string }, {}, {}>, res: Response) => {
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
});
