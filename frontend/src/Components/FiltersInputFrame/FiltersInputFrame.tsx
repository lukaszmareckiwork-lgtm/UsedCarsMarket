import type { ReactNode } from "react";
import "./FiltersInputFrame.css";

interface Props {
  children: ReactNode;
  className?: string;
}

const FiltersInputFrame = ({ children, className }: Props) => {
  return (
    <div className={`filters-input-frame ${className ? className : ""}`}>
        { children }
    </div>
    )
};

export default FiltersInputFrame;