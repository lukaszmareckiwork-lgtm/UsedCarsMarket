import "./SpecsList.css"
import { getReadableFuelType, getReadableTransmissionType, type OfferProps } from '@data/OfferProps'
import SpecsListItem from '@components/DetailsPage/SpecsListItem/SpecsListItem'
import { useMakes } from '@context/MakesContext'
import Spacer from "@components/Spacer/Spacer"

interface Props {
    offerProps: OfferProps
}

const SpecsList = ({ offerProps }: Props) => {
    const make = useMakes().makes.find((make) => make.makeId === offerProps.makeId);
    const model = make ? Object.values(make!.models).find(model => model.modelId === offerProps.modelId) : undefined;

    return (
        <div className='specs-list'>
            <SpecsListItem label='Make' value={make?.makeName} />
            <SpecsListItem label='Model' value={model?.modelName} />
            {offerProps.color && <SpecsListItem label='Color' value={offerProps.color} />}
            {offerProps.vin && <SpecsListItem label='VIN' value={offerProps.vin} />}
            <SpecsListItem label='Year' value={offerProps.year.toLocaleString()} />
            <Spacer size={8} />
            <SpecsListItem label='Fuel Type' value={getReadableFuelType(offerProps.fuelType)} />
            <SpecsListItem label='Engine Displacement' value={offerProps.engineDisplacement.toLocaleString()+" cc"} />
            <SpecsListItem label='Engine Power' value={offerProps.enginePower.toLocaleString()+" hp"} />
            <SpecsListItem label='Transmission' value={getReadableTransmissionType(offerProps.transmission)} />
            <Spacer size={8} />
            <SpecsListItem label='Mileage' value={offerProps.mileage.toLocaleString()+" km"} />
        </div>
    )
}

export default SpecsList