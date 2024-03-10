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
