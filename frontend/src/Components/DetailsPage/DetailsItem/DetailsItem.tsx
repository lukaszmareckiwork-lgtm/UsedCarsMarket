import type { ReactNode } from "react";
import "./DetailsItem.css";

interface Props {
  children: ReactNode;
  label?: string;
  iconNode?: ReactNode;
  className?: string;
}

const DetailsItem = ({ children, label, iconNode, className }: Props) => {
  return (
    <div className={`details-item ${className}`}>
        {label && (
            <div className="details-item-header">
                {iconNode}
                <p className="details-item-label">{label}</p>      
            </div>
        )}
        { children }
    </div>
    )
};

export default DetailsItem;
