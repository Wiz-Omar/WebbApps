import axios from "axios";

const BASE_URL = "http://localhost:8080";

// Interface for your API response, if needed
interface LikeStatusResponse {
  liked: boolean;
}

// Fetch like status for an image
export const getLikeStatus = async (imageId: string): Promise<boolean> => {
  try {
    const response = await axios.get<LikeStatusResponse>(
      `${BASE_URL}/like/${imageId}`
    );
    return response.data.liked;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
