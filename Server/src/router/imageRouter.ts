import express, { Request, Response } from "express";
import { ImageService } from "../service/imageService";
import { Image } from "../model/image";
import { validSortOrders, validSortFields } from "../model/sorting";
import { IImageService } from "../service/imageService.interface";
import { Session } from "express-session";
import { sessionData } from "./userRouter";
import multer from "multer";

interface GetImagesRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
  query: {
    sortField?: string;
    sortOrder?: string;
  };
}
interface PostImageRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
  body: { filename: string; url: string };
}
interface DeleteImageRequest extends Request {
  params: { imageId: string };
  session: Session & Partial<sessionData>;
  body: {};
}
interface SearchImageRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
  query: {
    search: string;
  };
}

const imageService: IImageService = new ImageService();

export const imageRouter = express.Router();

const upload = multer();

imageRouter.get("/", async (req: GetImagesRequest, res: Response) => {
  let sortField = req.query.sortField as string | undefined;
  let sortOrder = req.query.sortOrder as string | undefined;

  // Validate sortField
  if (sortField && !validSortFields.includes(sortField)) {
    res
      .status(400)
      .send(
        "Invalid sort field. Valid options are 'filename' or 'uploadDate'."
      );
    return;
  }
  // Validate sortOrder
  if (sortOrder && !validSortOrders.includes(sortOrder)) {
    res
      .status(400)
      .send("Invalid sort order. Valid options are 'asc' or 'desc'.");
    return;
  }
  if (!req.session.username) {
    res.status(401).send("Unauthorized action. User not logged in");
    return;
  }

  try {
    const images = await imageService.getImages(
      // We put undefind in the interface
      sortField,
      sortOrder,
      req.session.username
    );

    console.log("images", images);

    res.status(200).send(images);
  } catch (e: any) {
    console.error("Error getting images" + e);
    if (e.name === "ImageNotFoundError") {
      res.status(404).send(e.message);
    } else {
      res.status(500).send(e.message);
    }
  }
});

imageRouter.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  if (req.session.username === undefined) {
    res.status(401).send("Unauthorized action. User not logged in");
    return;
  }

  // Check if the file size is less than 10MB
  if (req.file.size > 1024 * 1024 * 10) {
    return res.status(413).send("File size exceeds limit of 10MB.");
  }

  // Check if the file type is JPEG, JPG or PNG
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(req.file.mimetype)) {
    return res.status(415).send("Invalid file type, only JPEG and PNG are allowed!");
  }

  try {
    // Convert the uploaded file to Base64
    const base64Data = req.file.buffer.toString("base64");
    const filename = req.file.originalname;

    if (typeof filename !== "string") {
      res.status(400).send("Invalid input data for filename or url");
      return;
    }

    const result = await imageService.addImage(
      filename,
      base64Data,
      req.session.username
    );
    res.status(201).json({ message: "Image uploaded successfully", result });
  } catch (e: any) {
    console.error("Error adding image" + e);
    res.status(500).send(e.message);
  }
});

imageRouter.delete(
  "/:id",
  //TODO: should we allow deletion of defaultUser images?
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
      if (req.session.username === undefined) {
        res.status(401).send("Cannot delete. User not logged in");
        return;
      }
      await imageService.deleteImage(imageId, req.session.username);
      res.status(200).send({ message: "Image successfully deleted" });
    } catch (e: any) {
      console.error("Error deleting image" + e);
      res.status(500).send(e.message);
    }
  }
);

//TODO: is it a code smell to have two get methods
imageRouter.get("/search", async (req: SearchImageRequest, res: Response) => {
  console.log("searching");
  try {
    const search = req.query.search as string;
    if (req.session.username === undefined) {
      res.status(401).send("Cannot search. User not logged in");
      return;
    }
    if (!search) {
      res.status(400).send("No search query provided");
      return;
    }
    const images = await imageService.getImageBySearch(
      search,
      req.session.username
    );
    res.status(200).send(images);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});
