import GridImg from "./GridImg/GridImg";
import { Image } from "../HomePage";
import NoImagesDisplay from "../../second_page/NoImagesDisplay/NoImagesDisplay";

export interface GridProps {
  images: Image[];
  callback: () => void;
}

/**
 * Grid component. A grid of images.
 * Composed of three columns of images. Each image is a GridImg component.
 * Uses the NoImagesDisplay component if there are no images.
 * 
 * Props:
 * - images: Image[] - The images to display in the grid
 * - callback: () => void - The function to call when an image is clicked
 */
function Grid({ images, callback }: GridProps) {
  // Initialize arrays for each column
  const columns: Image[][] = [[], [], []];

  // Distribute images into columns
  images.forEach((image, index) => {
    const columnIndex = index % 3; // This will cycle through 0, 1, 2 for each image
    columns[columnIndex].push(image);
  });

  // Check if there are no images
  if (images.length === 0) {
    return (
      <NoImagesDisplay data-testid="no-images-display"/>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {columns.map((columnImages, colIndex) => (
          <div key={colIndex} className="col-md-4">
            {columnImages.map((image, imageIndex) => (
              <GridImg key={imageIndex} image={image} callback={callback} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;
