import { useState, useEffect } from "react";
import { getImages } from "../utils/getImages"; // Ensure this is correctly imported
import { Image } from "../components/home_page/HomePage"; // Ensure this is correctly imported

interface UseImagesParams {
  sortField: string;
  sortOrder: string;
  onlyLiked: boolean;
  pathname: string;
  trigger: number; // Include trigger in the hook parameters
}

/**
 * Custom hook to fetch images from the server. Uses the getImages function to fetch images from the server based on the provided parameters.
 * Uses a trigger state to re-fetch images when the trigger state changes, e.g the client wants to refresh the images.
 */
export const useImages = ({
  sortField,
  sortOrder,
  onlyLiked,
  pathname,
  trigger, // Include trigger in the hook parameters
}: UseImagesParams) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const fetchedImages = await getImages(sortField, sortOrder, onlyLiked);
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [sortField, sortOrder, onlyLiked, pathname, trigger]); // Include trigger in the dependency array

  return { images, isLoading };
};
