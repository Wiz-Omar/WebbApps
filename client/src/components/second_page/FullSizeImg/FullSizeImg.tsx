import React from "react";

import "./FullSizeImg.css";
import IconButton from "../../common/IconButton/IconButton";
import { Image } from "../../home_page/HomePage";

interface FullSizeImageProps {
  image: Image;
  onClose: () => void;
}

/**
 * FullSizeImage component. A full-size image that can be closed.
 * 
 * Props:
 * - image: Image - The image to display
 * - onClose: () => void - The function to call when the full-size image is closed
 */
const FullSizeImage = ({ image, onClose }: FullSizeImageProps) => {
  const handleClick = () => {
    onClose(); // Call the onClose callback to close the full-size image
  };

  return (
    <div className="full-size-image-container" onClick={handleClick} data-testid="close-full-size-image">
      <img src={image.path} alt="Full Size" />
      <div style={{ position: "absolute", right: 5, top: 5}}>
      </div>
    </div>
  );
};

export default FullSizeImage;
