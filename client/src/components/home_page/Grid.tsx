import React from "react";
import GridImg from "./GridImg";
import { Image } from "../../components/home_page/HomePage";

export interface GridProps {
  images: Image[];
  callback: () => void;
}

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
      <div className="container mt-4 text-center">
        <p data-testid="no-images-message">No images to display.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {columns.map((columnImages, colIndex) => (
          <div key={colIndex} className="col-md-4">
            {columnImages.map((image, imageIndex) => (
              // TODO: change to image.filename?
              <GridImg key={imageIndex} image={image} callback={callback} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;
