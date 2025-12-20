import React from 'react'
import "./IconCounterButton.css"

type Props = {
  count: number;
  route: string;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
};

const IconCounterButton = ({ count, route, icon, onClick, disabled, className }: Props) => {

  return (
    <a
      href={route}
      className={`icb ${disabled ? "disabled" : ""} ${className || ""}`}
      onClick={onClick}
    >
      {icon}
      <div className="icb-count-text">{count > 0 && `(${count})`}</div>
    </a>
  );
};

export default IconCounterButton;
