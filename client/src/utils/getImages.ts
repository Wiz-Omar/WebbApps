import axios from "axios";
import { Image } from "../components/home_page/HomePage";
import { API_BASE_URL, IMAGE_ENDPOINT } from "../constants/apiEndpoints";

// Default sorting field
export const DEFAULT_SORT_FIELD = "uploadDate";

// Default sorting order
export const DEFAULT_SORT_ORDER = "desc";

// Default value for onlyLiked filter
export const DEFAULT_ONLY_LIKED = false;

/**
 * Fetches images from the server. Makes a GET request to the server and returns the images.
 * @param sortField The field to sort by.
 * @param sortOrder The order to sort by.
 * @param onlyLiked Whether to only fetch liked images.
 * @returns A promise that resolves to an array of Image objects.
 */
export async function getImages(
  sortField: string = DEFAULT_SORT_FIELD,
  sortOrder: string = DEFAULT_SORT_ORDER,
  onlyLiked: boolean = DEFAULT_ONLY_LIKED
): Promise<Image[]> {
  try {
    const url = `${IMAGE_ENDPOINT}?sortField=${sortField}&sortOrder=${sortOrder}&onlyLiked=${onlyLiked}`;
    const response = await axios.get<Image[]>(url);
    return response.data;
  } catch (error) {
    return [];
  }
}
