import { Image } from "../components/home_page/HomePage";

/**
 * Initiates a download of the given image.
 * @param {Image} image - The image object containing the path and filename.
 */
export const handleDownload = async (image: Image) => {
    // Fetch the image as a blob
    const response = await fetch(image.path);
    const blob = await response.blob();

    // Create an object URL for the blob
    const objectUrl = window.URL.createObjectURL(blob);

    // Create a link and force download
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = image.filename || 'downloaded-image';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  };
  