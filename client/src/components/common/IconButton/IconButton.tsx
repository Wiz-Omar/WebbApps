import React from "react";

import "./IconButton.css";

export interface IconButtonProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  //TODO: check what aria-label is. Something to do with accessibility!
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const IconButton = ({ Icon, ariaLabel, onClick } : IconButtonProps) => {
  return (
    <button className="svg-button" aria-label={ariaLabel} onClick={onClick}>
      <Icon />
    </button>
  );
};

export default IconButton;
