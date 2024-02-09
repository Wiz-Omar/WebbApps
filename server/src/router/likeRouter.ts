import express, { Request, Response } from "express";
import { LikeService } from "../service/likeService";

const imageService = new LikeService();

export const likeRouter = express.Router();

// Endpoint for liking an image
likeRouter.post('/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params;
        // Implement logic to like the image
        await imageService.likeImage(imageId);
        res.status(200).send('Image liked successfully');
    } catch (error) {
        console.error('Error liking image:', error);
        res.status(500).send('Internal server error');
    }
});

// Endpoint for unliking an image
likeRouter.delete('/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params;
        // Implement logic to unlike the image
        await imageService.unlikeImage(imageId);
        res.status(200).send('Image unliked successfully');
    } catch (error) {
        console.error('Error unliking image:', error);
        res.status(500).send('Internal server error');
    }
});

// Endpoint for getting all liked imageIDs
//TODO: is this necessary?
likeRouter.get('/', async (req, res) => {
    try {
        const likedImages = await imageService.getLikedImages();
        res.status(200).send(likedImages);
    } catch (error) {
        console.error('Error getting liked images:', error);
        res.status(500).send('Internal server error');
    }
});
