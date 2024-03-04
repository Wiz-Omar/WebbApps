import React from "react";
import FilledHeartIcon from "../common/FilledHeartIcon";
import UnfilledHeartIcon from "../common/UnfilledHeartIcon";
import Icon from "../common/Icon";
import "./Button.css";

interface FavoriteButtonProps {
  isLiked: boolean;
  callback: () => void;
}

const FavoriteButton = ({ isLiked, callback }: FavoriteButtonProps) => {
  return (
  <div className="button" onClick={callback}>
    <Icon Icon={isLiked ? FilledHeartIcon : UnfilledHeartIcon} />
  </div>
  );
};

export default FavoriteButton;
