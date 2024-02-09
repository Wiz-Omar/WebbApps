import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "../App";

import "./GridImg.css";
import DownloadIcon from "./DownloadIcon";
import IconButton from "./IconButton";
import FilledHeartIcon from "./FilledHeartIcon";
import FavoriteButton from "./FavoriteButton";
import GridImgDescription from "./GridImgDescription";
import axios from "axios";

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

  const [isLiked, setIsLiked] = useState(false);

  async function getLike(imageId: string) {
    try {
      const response = await axios.get(`http://localhost:8080/like`);
      const likedImages = response.data;
      // check if image.id is in likedImages
      //TODO: write functionality for checking for just one image instead
      setIsLiked(likedImages.includes(imageId));
    } catch (error) {
      console.error(error);
    }
  }

  // set like status
  async function setLike(imageId: string) {
    try {
      const response = await axios.post(
        `http://localhost:8080/like/${imageId}`
      );
      // if response is 200, set isLiked to true
      if (response.status === 200) {
        setIsLiked(true);
      }
    } catch (error) {
      //TODO: show that something went wrong
      console.error(error);
    }
  }

  // set unlike status
  async function setUnlike(imageId: string) {
    try {
      const response = await axios.delete(
        `http://localhost:8080/like/${imageId}`
      );
      if (response.status === 200) {
        setIsLiked(false);
      }
    } catch (error) {}
  }

  useEffect(() => {
    //TODO: fix later, will id be a string or a number?
    getLike(image.id.toString());
  }, [image.id]);

  const handleCallback = async () => {
    const imageId = image.id.toString(); // Assuming image.id is the identifier used in your backend
    if (isLiked) {
      await setUnlike(imageId); // If the image is currently liked, send a request to unlike it
    } else {
      await setLike(imageId); // If the image is currently unliked, send a request to like it
    }
    // The setIsLiked state update is now moved inside the setLike and setUnlike functions
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
            <FavoriteButton isLiked={isLiked} callback={handleCallback} />
          </div>
          <div
            className="download-icon-container"
            style={{ position: "absolute", left: 5, bottom: 5 }}
          >
            <GridImgDescription child={image.filename} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GridImg;
