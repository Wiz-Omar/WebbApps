import React from "react";

import "./GridImgDescription.css";

interface GridImgDescriptionProps {
    child: string
}

const GridImgDescription = ( {child} : GridImgDescriptionProps) => {
  return (
    <div 
    className="grid-img-description"
        style={{ position: "absolute", left: 5, bottom: 5, }}>
      {child}
    </div>
  );
};

export default GridImgDescription;
