import React from 'react';
import "./Icon.css";

interface ClickableIconProps {
    icon: React.ReactElement; // Use React.ReactElement to accept any React element
    ariaLabel?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    style?: React.CSSProperties;
}

/**
 * ClickableIcon component. A button with an icon.
 * 
 * Props:
 * - icon: React.ReactElement - The icon to display
 * - ariaLabel: string - The aria-label for the button
 * - onClick: React.MouseEventHandler<HTMLButtonElement> - The function to call when the button is clicked
 * - style: React.CSSProperties - The style for the button
 */
const ClickableIcon = ({icon, ariaLabel, onClick, style}: ClickableIconProps) => {
  return (
    <button className="svg-icon" aria-label={ariaLabel} onClick={onClick} style={style}>
      {icon}
    </button>
  )
}

export default ClickableIcon;
