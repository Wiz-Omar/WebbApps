import axios from 'axios';
import { LIKE_ENDPOINT } from '../constants/apiEndpoints';

/**
 * Sets the like status of an image. Makes a POST request to the server to like an image, and a DELETE request to unlike an image.
 * @param imageId The ID of the image to like or unlike.
 * @param like The new like status of the image.
 * @returns A promise that resolves to the new like status of the image.
 */
export const setLike = async (imageId: string, like: boolean): Promise<boolean> => {
    try {
        const url = `${LIKE_ENDPOINT}/${imageId}`;
        if (like) {
            await axios.post(url);
        } else {
            await axios.delete(url);
        }
        return like;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
