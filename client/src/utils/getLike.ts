import axios from "axios";
import { LIKE_ENDPOINT } from "../constants/apiEndpoints";

interface LikeStatusResponse {
  liked: boolean;
}

/**
 * Retrieves the like status of the image with the given ID.
 * 
 * @param imageId - The ID of the image to check the like status of.
 * @returns A promise that resolves to a boolean indicating whether the image is liked by the user.
 * @throws An error if the request fails.
 */
export const getLikeStatus = async (imageId: string): Promise<boolean> => {
  try {
    const response = await axios.get<LikeStatusResponse>(
      `${LIKE_ENDPOINT}/${imageId}`
    );
    return response.data.liked;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};
