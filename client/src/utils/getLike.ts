import axios from "axios";

const BASE_URL = "http://localhost:8080";

/**
 * Fetches images from the server. Makes a GET request to the server and returns the images.
 * @param imageId The id of the image to check the like status for. Type string.
 * @returns A promise that resolves to a boolean indicating whether the image is liked.
 */
export const getLikeStatus = async (imageId: string): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/like/${imageId}`
    );
    return response.data.liked;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};
