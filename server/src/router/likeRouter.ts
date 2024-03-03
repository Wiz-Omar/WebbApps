import express, { Request, Response } from "express";
import { LikeService } from "../service/likeService";
import { ILikeService } from "../service/likeService.interface";
import { Session } from "express-session";
import { sessionData } from "./userRouter";

export const likeService : ILikeService = new LikeService();
export const likeRouter = express.Router();

interface ImageFetchRequest extends Request{
    params: {},
    session: Session & Partial<sessionData>,
    body: {
        imageId: string, //TODO: should this be a number or is it correct to parse the recieved string?
    }
}
interface ImageLikeRequest extends Request{
    body: {}, 
    session: Session & Partial<sessionData>,
    params: {
        imageId: string,
    }
}
interface AllLikedImagesRequest extends Request{
    params: {},
    session: Session & Partial<sessionData>,
    body: {}
}

// Endpoint for liking an image
//TODO: should we allow liking of images for deafultUser images?
likeRouter.post('/:imageId',
    async (
        req: ImageLikeRequest, 
        res: Response
    ) => {
    try {
        //const { imageId } = req.params;
        // Implement logic to like the image
        //await likeService.likeImage(imageId);
        const imageId = req.params.imageId;
        console.log("imageId: ", imageId);

        if (typeof imageId !== "string" || imageId === "" /*|| imageId.length !== 24 ??*/) {
            res.status(400).send("Invalid image ID");
            return;
        }
        if (req.session.username === undefined) {
            res.status(401).send("Unauthorized action. User not logged in");
            return;
        }
        likeService.likeImage(imageId, req.session.username);
        res.status(200).send('Image liked successfully');
        return;
    } catch (error: any) {
        console.error('Error liking image:', error);
        if (error.name === "LikeExistsError") {
            res.status(409).send(error.message);
        }else if (error.name === "ImageNotFoundError") {
            res.status(404).send(error.message);
        }else{
            res.status(500).send('Internal server error');
        }
    }
});

// Endpoint for unliking an image
likeRouter.delete('/:imageId', async (req: ImageLikeRequest, res: Response) => {
    try {
        const imageId = req.params.imageId;

        if (typeof imageId !== "string" || imageId === "" /*|| imageId.length !== 24 ??*/) {
            res.status(400).send("Invalid image ID");
            return;
          }
        if (req.session.username === undefined) {
            res.status(401).send("Unauthorized action. User not logged in");
            return;
        }
        await likeService.unlikeImage(imageId, req.session.username);
        res.status(200).send('Image unliked successfully');
        return;
    } catch (error: any) {
        console.error('Error unliking image:', error);
        if (error.name === "ImageNotFoundError") {
            res.status(404).send(error.message);
        }else{
            res.status(500).send(error.message);
        }
    }
});

// Endpont for getting the liked status of an image
likeRouter.get('/:imageId', async (req: ImageLikeRequest, res: Response) => {
    try {
        const imageId = req.params.imageId;
        if (typeof imageId !== "string" || imageId === "" /*|| imageId.length !== 24 ??*/) {
            res.status(400).send("Invalid image ID");
            return;
          }
        if (req.session.username === undefined) {
            res.status(401).send("Unauthorized action. User not logged in");
            return;
        }
        const liked: Boolean = await likeService.isImageLiked(imageId, req.session.username);
        // Implement logic to get the liked status of the image
        //const liked = await likeService.isImageLiked(imageId, username);
        res.status(200).send({ liked });
    } catch (error: any) {
        console.error('Error getting liked status for image:', error);
        if (error.name === "ImageNotFoundError") {
            res.status(404).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }
});

// Endpoint for getting all liked imageIDs
//TODO: is this necessary?
likeRouter.get('/', 
    async (
        req: AllLikedImagesRequest,
        res: Response
    ) => {
        try {
            if (req.session.username === undefined) {
                res.status(401).send("Unauthorized action. User not logged in");
                return;
            }
            const likedImages = await likeService.getLikedImages(req.session.username);
            res.status(200).send(likedImages);
            
        } catch (error) {
            console.error('Error getting liked images:', error);
            res.status(500).send('Internal server error');
        }
    }
);
