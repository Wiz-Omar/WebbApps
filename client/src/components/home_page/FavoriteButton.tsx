import React from "react";
import FilledHeartIcon from "../common/FilledHeartIcon";

import "./Button.css";
import UnfilledHeartIcon from "../common/UnfilledHeartIcon";

interface FavoriteButtonProps {
  isLiked: boolean;
  callback: () => void;
}

const FavoriteButton = ({ isLiked, callback }: FavoriteButtonProps) => {
  return (
    <div className="button" onClick={ callback }>
      {isLiked ? <FilledHeartIcon /> : <UnfilledHeartIcon />}
    </div>
  );
};

export default FavoriteButton;
