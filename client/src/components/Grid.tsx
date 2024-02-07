import React from "react";
import GridImg from "./GridImg";

interface GridProps {
    images: string[];
  }
  
  function Grid({ images }: GridProps) {
    // Initialize arrays for each column
    const columns: string[][] = [[], [], []];
  
    // Distribute images into columns
    images.forEach((image, index) => {
      const columnIndex = index % 3; // This will cycle through 0, 1, 2 for each image
      columns[columnIndex].push(image);
    });

    console.log(columns);
  
    return (
      <div className="container mt-4">
        <div className="row">
          {columns.map((columnImages, colIndex) => (
            console.log(colIndex),
            <div key={colIndex} className="col-md-4">
              {columnImages.map((image, imageIndex) => (
                <GridImg key={imageIndex} image={image}></GridImg>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default Grid;