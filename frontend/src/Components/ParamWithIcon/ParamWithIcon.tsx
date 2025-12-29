import React, { type ReactElement } from 'react';
import './ParamWithIcon.css';

interface ParamWithIconProps {
  icon: ReactElement;   // React icon component
  label: string;        // e.g. "Mileage"
  value: string | number; // e.g. 70000
  unit?: string;        // optional unit like "km"
  className?: string;   // optional additional classes
  hideLabel?: boolean;
}

const ParamWithIcon: React.FC<ParamWithIconProps> = ({ icon, label, value, unit, className = '', hideLabel = false }) => {
  return (
    <div className={`paramWithIconWrapper ${className}`}>
      <span className="paramIcon">{React.isValidElement(icon) ? React.cloneElement(icon, { ['aria-hidden']: true, focusable: false } as any) : icon}</span>
      <span className='paramTexts'>
        {!hideLabel && <span className='paramWithIconLabel'>{label}</span>}
        <span className='paramWithIconValue'>{value} {unit || ''}</span>
      </span>
    </div>
  );
};

export default ParamWithIcon;
