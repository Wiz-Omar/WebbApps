import axios from "axios";
import { IMAGE_ENDPOINT } from "../constants/apiEndpoints";

axios.defaults.withCredentials = true;

/**
 * Change the name of an image. Make a PATCH request to the server.
 * @param imageId The ID of the image to change the name of.
 * @param filename The new filename for the image.
 * @param fileExtension The file extension of the image.
 * @returns 
 */
export const handleChangeName = async (imageId: number, filename: string, fileExtension: string) => {
    return await axios.patch(`${IMAGE_ENDPOINT}/${imageId}`, {
        newFilename: `${filename}.${fileExtension}`,
    });
};
