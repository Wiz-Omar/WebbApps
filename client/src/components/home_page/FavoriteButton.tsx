import React from "react";
import FilledHeartIcon from "../common/FilledHeartIcon";

import "./FavoriteButton.css";
import UnfilledHeartIcon from "../common/UnfilledHeartIcon";

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
