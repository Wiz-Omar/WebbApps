import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "../../HomePage";

import "./GridImg.css";
import FavoriteButton from "../../FavoriteButton/FavoriteButton";
import GridImgDescription from "../GridImgDescription/GridImgDescription";
import DeleteButton from "../../DeleteButton";
import { handleDelete } from "../../../../utils/handleDelete";
import { getLikeStatus } from "../../../../utils/getLike";
import { setLike } from "../../../../utils/setLike";

interface GridImgProps {
  image: Image;
  callback: () => void;
}

function GridImg({ image, callback }: GridImgProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const isLiked = await getLikeStatus(image.id.toString());
        setIsLiked(isLiked);
      } catch (error) {
        // Could handle the error, but probably no need to display anything to the user
      }
    };

    fetchLikeStatus();
  }, [image.id]);

  const handleCallback = async () => {
    const imageId = image.id.toString();
    try {
      // Toggle the like status based on the current state
      const newIsLiked = await setLike(imageId, !isLiked);
      setIsLiked(newIsLiked); // Update the state based on the response
    } catch (error) {
      // Could handle the error, but probably no need to display anything to the user
    }
  };

  const onDelete = async () => {
    try {
      const response = await handleDelete(image.id);
      if (response.status === 200) {
        callback();
      }
    } catch (error) {
      alert("Error deleting image");
    }
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
          <div className="button-column button-column-container">
            <div className="button-container" style={{ display: "flex" }}>
              <DeleteButton callback={onDelete} />
              <FavoriteButton isLiked={isLiked} callback={handleCallback} />
            </div>
          </div>

          <div className="description-icon-container">
            <GridImgDescription child={image.filename} />
          </div>
        </>
      )}
    </div>
  );
}

export default GridImg;
