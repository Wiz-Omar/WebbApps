import React from 'react'
import "./Icon.css";

interface IconProps {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    ariaLabel?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    style?: React.CSSProperties;
}

const Icon = ({Icon, ariaLabel, onClick, style}: IconProps) => {
  return (
    <button className="svg-icon" aria-label={ariaLabel} onClick={onClick}>
      <Icon style={style}/>
    </button>
  )
}

export default Icon