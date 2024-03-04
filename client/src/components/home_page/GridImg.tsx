import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "../../components/home_page/HomePage";

import "./GridImg.css";
import DownloadIcon from "../second_page/Navbar/DownloadIcon";
import IconButton from "../common/IconButton";
import FilledHeartIcon from "../common/FilledHeartIcon";
import FavoriteButton from "./FavoriteButton";
import GridImgDescription from "./GridImgDescription";
import axios from "axios";
import DeleteButton from "./DeleteButton";
import { handleDelete } from "../../utils/handleDelete";

interface GridImgProps {
  image: Image;
  callback: () => void;
}

function GridImg({ image, callback }: GridImgProps) {
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
      const response = await axios.get(`http://localhost:8080/like/${imageId}`);
      const isLiked = response.data.liked;
      // check if image.id is in likedImages
      //TODO: write functionality for checking for just one image instead
      setIsLiked(isLiked);
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
    console.log(!image.id);
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

  const onDelete = async () => {
    try {
      const response = await handleDelete(image.id);
      if (response.status === 200) {
        // TODO: fix delete
        callback();
        console.log("image deleted");
      }
    } catch (error) {}
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }}
    >
      <img
        src={image.path}
        alt="Image"
        className="grid-img"
        loading="lazy"
        onClick={handleClick}
      />
      {isHovered && (
        <>
          <div
            className="button-column"
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div className="button-container" style={{ display: "flex" }}>
              <DeleteButton callback={onDelete} />
              <FavoriteButton isLiked={isLiked} callback={handleCallback} />
            </div>
          </div>
          <div
            className="description-icon-container"
            style={{ position: "absolute", left: 5, bottom: 5 }}
          >
            <GridImgDescription child={image.filename} />
          </div>
        </>
      )}
    </div>
  );
}

export default GridImg;
