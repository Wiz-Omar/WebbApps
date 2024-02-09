import React from "react";
import FilledHeartIcon from "./FilledHeartIcon";

import "./FavoriteButton.css";
import UnfilledHeartIcon from "./UnfilledHeartIcon";

interface FavoriteButtonProps {
  isLiked: boolean;
  callback: () => void;
}

const FavoriteButton = ({ isLiked, callback }: FavoriteButtonProps) => {
  return (
    <div className="favorite-button" onClick={ callback }>
      {isLiked ? <FilledHeartIcon /> : <UnfilledHeartIcon />}
    </div>
  );
};

export default FavoriteButton;
