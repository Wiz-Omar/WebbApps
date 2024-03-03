import React from "react";

import "./FullSizeImg.css";
import IconButton from "../common/IconButton";
import MinimizeIcon from "./MinimizeIcon";
import { Image } from "../home_page/HomePage";

interface FullSizeImageProps {
  image: Image;
  onClose: () => void;
}

const FullSizeImage = ({ image, onClose }: FullSizeImageProps) => {
  const handleClick = () => {
    onClose(); // Call the onClose callback to close the full-size image
  };

  return (
    <div className="full-size-image-container" onClick={handleClick}>
      <img src={image.path} alt="Full Size" />
      <div style={{ position: "absolute", right: 5, top: 5}}>
      </div>
    </div>
  );
};

export default FullSizeImage;
