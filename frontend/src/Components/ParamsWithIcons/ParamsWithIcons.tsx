import "./ParamsWithIcons.css"
import { FaGasPump, FaCalendarAlt, FaRoad } from 'react-icons/fa';
import ParamWithIcon from '@components/ParamWithIcon/ParamWithIcon';
import { GiGearStickPattern } from 'react-icons/gi';
import { MdOutlineSpeed } from 'react-icons/md';
import { PiEngineBold } from 'react-icons/pi';
import { getReadableFuelType, getReadableTransmissionType, type OfferProps } from '@data/OfferProps';

interface Props {
  offerProps: OfferProps
  iconSize: number
  hideLabel?: boolean
  spaceEvenly?: boolean
}

const ParamsWithIcons = ({ offerProps, iconSize: iconSize, hideLabel = false, spaceEvenly = false }: Props) => {
  return (
    <dl className={`paramsWithIcons ${spaceEvenly ? "evenly" : ""}`}>
      <ParamWithIcon icon={<FaRoad size={iconSize} />} label="Mileage" value={Intl.NumberFormat("pl-PL").format(offerProps.mileage)} unit="km" hideLabel={hideLabel} />
      <ParamWithIcon icon={<FaGasPump size={iconSize - 4} />} label="Fuel Type" value={getReadableFuelType(offerProps.fuelType)} hideLabel={hideLabel} />
      <ParamWithIcon icon={<GiGearStickPattern size={iconSize} />} label="Transmission" value={getReadableTransmissionType(offerProps.transmission)} hideLabel={hideLabel} />
      <ParamWithIcon icon={<PiEngineBold  size={iconSize} />} label="Engine Displacement" value={Intl.NumberFormat("pl-PL").format(offerProps.engineDisplacement)} unit="cc" hideLabel={hideLabel} />
      <ParamWithIcon icon={<MdOutlineSpeed  size={iconSize + 2} />} label="Engine Power" value={Intl.NumberFormat("pl-PL").format(offerProps.enginePower)} unit="hp" hideLabel={hideLabel} />
      <ParamWithIcon icon={<FaCalendarAlt size={iconSize - 4} />} label="Year" value={offerProps.year} hideLabel={hideLabel} />
    </dl>
  )
}

export default ParamsWithIcons