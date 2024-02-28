import express, { Request, Response } from "express";
import { ImageService } from "../service/imageService";
import { Image } from "../model/image";
import { validSortOrders, validSortFields } from "../model/sorting";
import { IImageService } from "../service/imageService.interface";
import { Session } from "express-session";
import { sessionData } from "./userRouter";

interface GetImagesRequest extends Request{
  params: {};
  session: Session & Partial<sessionData>,
  query: {
    sortField?: string;
    sortOrder?: string;
  };
}
interface PostImageRequest extends Request{
  params: {},
  session: Session & Partial<sessionData>,
  body: {filename: string, url: string}
}
interface DeleteImageRequest extends Request{
  params: {imageId: string},
  session: Session & Partial<sessionData>,
  body: {}
}
const imageService: IImageService = new ImageService();

export const imageRouter = express.Router();

imageRouter.get("/", async (req: GetImagesRequest, res: Response) => {
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
    if (!req.session.userId) {
        res.status(401).send("Unauthorized action. User not logged in");
        return;
    }

    const images = await imageService.getImages(
      //We put undefind in the interface 
      sortField,
      sortOrder,
      req.session.userId
    );
    res.status(200).send(images);
  } catch (e: any) {
    console.error("Error getting images" + e);
    if(e.name === "ImageNotFoundError"){
      res.status(404).send(e.message);
    }else{
      res.status(500).send(e.message);
    }
  }
});

imageRouter.post(
  "/",
  async (
    req: PostImageRequest,
    res: Response
  ) => {
    try {
      const {filename, url} = req.body;

      if (typeof filename !== "string" || typeof url !== "string") {
        res.status(400).send("Invalid input data for filename or url");
        return;
      }
      if (req.session.userId === undefined) {
        res.status(401).send("Unauthorized action. User not logged in");
        return;
      }
      const newImage = await imageService.addImage(filename, url, req.session.userId);
      res.status(201).send(newImage);
    } catch (e: any) {
      console.error("Error adding image" + e);
      res.status(500).send(e.message);
    }
  }
);

imageRouter.delete(
  "/:id",
  //TODO: should we allow deletion of defaultUser images?
  async (req: DeleteImageRequest, res: Response) => { 
    try {
      const imageId = req.params.imageId;
      if (typeof imageId !== "string" || imageId === "" /*|| imageId.length !== 24 ??*/) {
        res.status(400).send("Invalid image ID");
        return;
      }       
      if (req.session.userId === undefined) {
        res.status(401).send("Unauthorized action. User not logged in");
        return;
      }
      await imageService.deleteImage(imageId, req.session.userId);
      res.status(200).send({ message: "Image successfully deleted" });
    } catch (e: any) {
      console.error("Error deleting image" + e);
      res.status(500).send(e.message);
    }
  }
);
