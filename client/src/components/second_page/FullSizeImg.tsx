import React from "react";

import "./FullSizeImg.css";
import IconButton from "../common/IconButton";
import MinimizeIcon from "./MinimizeIcon";

interface FullSizeImageProps {
  imageUrl: string;
  onClose: () => void;
}

const FullSizeImage = ({ imageUrl, onClose }: FullSizeImageProps) => {
  const handleClick = () => {
    onClose(); // Call the onClose callback to close the full-size image
  };

  return (
    <div className="full-size-image-container" onClick={handleClick}>
      <img src={imageUrl} alt="Full Size" />
      <div style={{ position: "absolute", right: 5, top: 5}}>
      </div>
    </div>
  );
};

export default FullSizeImage;
