import React from 'react';
import "./Icon.css";

interface ClickableIconProps {
    icon: React.ReactElement; // Use React.ReactElement to accept any React element
    ariaLabel?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    style?: React.CSSProperties;
}

const ClickableIcon = ({icon, ariaLabel, onClick, style}: ClickableIconProps) => {
  return (
    <button className="svg-icon" aria-label={ariaLabel} onClick={onClick} style={style}>
      {icon} {/* Directly render the React element */}
    </button>
  )
}

export default ClickableIcon;
