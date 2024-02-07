import React from "react";

import "./GridImg.css";

interface GridImgProps {
  image: string;
}

function GridImg( {image} : GridImgProps) {
  return <img src={image} alt="Image" className="grid-img" loading="lazy"></img>;
}

export default GridImg;
