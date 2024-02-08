import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "../App";

import "./GridImg.css";
import DownloadIcon from "./DownloadIcon";
import IconButton from "./IconButton";
import HeartIcon from "./HeartIcon";
import FavoriteButton from "./FavoriteButton";
import GridImgDescription from "./GridImgDescription";

interface GridImgProps {
  image: Image;
}

function GridImg({ image }: GridImgProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick: React.MouseEventHandler<HTMLImageElement> = () => {
    // Navigate to the second page. You can also pass state if needed
    navigate(`/second`, { state: { image } });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }} // Ensure the container has a position to position the icon
    >
      <img
        src={image.url}
        alt="Image"
        className="grid-img"
        loading="lazy"
        onClick={handleClick}
      />
      {isHovered && (
        <div>
          <div
            className="download-icon-container"
            style={{ position: "absolute", top: 5, right: 5 }}
          >
            <FavoriteButton />
          </div>
          <div
          className="download-icon-container"
          style={{ position: "absolute", left: 5, bottom: 5 }}
        >
          <GridImgDescription child={image.filename}/>
        </div>
      </div>
      )}
    </div>
  );
}

export default GridImg;
