import React from "react";

import "./GridImg.css";
import { useNavigate } from "react-router-dom";

interface GridImgProps {
  image: string;
}

function GridImg({ image }: GridImgProps) {
  const navigate = useNavigate();

  const handleClick: React.MouseEventHandler<HTMLImageElement> = () => {
    // Navigate to the second page. You can also pass state if needed
    navigate(`/second`, { state: { image } });
  };

  return (
    <img
      src={image}
      alt="Image"
      className="grid-img"
      loading="lazy"
      onClick={handleClick}
    />
  );
}

export default GridImg;
