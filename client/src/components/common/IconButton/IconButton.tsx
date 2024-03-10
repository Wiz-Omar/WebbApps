import React from "react";

import "./IconButton.css";

export interface IconButtonProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * IconButton component. A button with an icon.
 * 
 * Props:
 * - Icon: React.FC<React.SVGProps<SVGSVGElement>> - The icon to display
 * - ariaLabel: string - The aria-label for the button
 * - onClick: React.MouseEventHandler<HTMLButtonElement> - The function to call when the button is clicked
 */
const IconButton = ({ Icon, ariaLabel, onClick } : IconButtonProps) => {
  return (
    <button className="svg-button" aria-label={ariaLabel} onClick={onClick}>
      <Icon />
    </button>
  );
};

export default IconButton;
