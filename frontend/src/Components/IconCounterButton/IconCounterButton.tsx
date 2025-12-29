import React from 'react'
import "./IconCounterButton.css"

type Props = {
  count: number;
  route: string;
  icon: React.ReactNode;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
};

const IconCounterButton = ({ count, route, icon, ariaLabel, onClick, disabled, className }: Props) => {

  return (
    <a
      href={route}
      aria-label={ariaLabel}
      className={`icb ${disabled ? "disabled" : ""} ${className || ""}`}
      onClick={onClick}
    >
      <span className="icb-icon" aria-hidden={true}>{icon}</span>
      <div className="icb-count-text">{count > 0 && `(${count})`}</div>
    </a>
  );
};

export default IconCounterButton;
