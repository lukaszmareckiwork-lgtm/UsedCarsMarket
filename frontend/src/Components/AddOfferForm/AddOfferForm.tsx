import { useForm, type SubmitHandler } from "react-hook-form";
import { ParamInput } from "@components/ParamInput/ParamInput";
import "./AddOfferForm.css";
import {
  FuelTypeEnum,
  TransmissionTypeEnum,
  CurrencyTypeEnum,
  getReadableFuelType,
  getReadableTransmissionType,
  getReadableCurrencyType,
  FeatureTypeEnum,
  getReadableFeatureType,
} from "@data/OfferProps";
import { useMakes } from "@context/MakesContext";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreateOfferRequestDto } from "@data/CreateOfferRequestDto";
import { PhotoUploader } from "@components/PhotoUploader/PhotoUploader";
import { LocationPicker, LocationPickerModeEnum } from "@components/LocationPicker/LocationPicker";
import BlockingLoader from "@components/BlockingLoader/BlockingLoader";
import DetailsItem from "@components/DetailsPage/DetailsItem/DetailsItem";
import { FaCar, FaIdCard } from "react-icons/fa";
import Spacer from "@components/Spacer/Spacer";
import { addOfferValidationSchema } from "@validation/addOfferValidationSchema";

interface Props {
  handleOfferFormSubmit: (newOffer: CreateOfferRequestDto) => void;
  waitingForResponse: boolean
}

const AddOfferForm = ({ handleOfferFormSubmit, waitingForResponse }: Props) => {
  const { makes } = useMakes();

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CreateOfferRequestDto>(
    {
      mode: "onChange",
      defaultValues: {
        makeId: 0,
        modelId: 0,
        year: undefined,
        mileage: undefined,
        fuelType: FuelTypeEnum.Petrol,
        engineDisplacement: undefined,
        enginePower: undefined,
        transmission: TransmissionTypeEnum.Manual,
        color: "",
        vin: "",
        title: "",
        subtitle: "",
        description: "",
        features: [],
        locationName: "",
        locationLat: undefined,
        locationLong: undefined,
        price: undefined,
        currency: CurrencyTypeEnum.Usd,
        photosFiles: [],
      },
      resolver: yupResolver(addOfferValidationSchema) as any,
    }
  );

  const selectedMake = makes.find((m) => m.makeId === watch("makeId"));
  const availableModels = selectedMake
    ? Object.values(selectedMake.models)
    : [];

  const onSubmit: SubmitHandler<CreateOfferRequestDto> = (data) => {
    // data.id = crypto.randomUUID();
    handleOfferFormSubmit(data);
  };

  const toOption = <T extends number>(
    obj: Record<string, T>,
    getLabel: (v: T) => string
  ) =>
    Object.entries(obj)
      .filter(([_, v]) => typeof v === "number")
      .map(([_, v]) => ({ value: v as T, label: getLabel(v as T) }));

  return (
    <form className="add-offer-form" onSubmit={handleSubmit(onSubmit)}>
      <div 
        data-testid="hook-form-errors"
        style={{ display: "none" }}>
          {JSON.stringify(errors)}
      </div>
      <h2>Add a New Offer</h2>

      {/* Vehicle Information */}
      <DetailsItem label="Vehicle Information" iconNode={<FaCar size={22} aria-hidden={true} focusable={false}/>}> 
        <div className="form-grid">
          <ParamInput
            name="makeId"
            label="Make"
            control={control}
            type="select"
            options={makes.map((m) => ({
              value: m.makeId,
              label: m.makeName,
            }))}
            numeric
            placeholder="Select make"
          />
          <ParamInput
            name="modelId"
            label="Model"
            control={control}
            type="select"
            options={availableModels.map((m) => ({
              value: m.modelId,
              label: m.modelName,
            }))}
            numeric
            placeholder="Select model"
          />
          <ParamInput
            name="year"
            label="Year"
            type="number"
            control={control}
            numeric
            placeholder="e.g. 1999"
          />
          <ParamInput
            name="mileage"
            label="Mileage (km)"
            type="number"
            control={control}
            numeric
            placeholder="e.g. 12345"
          />
          <ParamInput
            name="fuelType"
            label="Fuel Type"
            control={control}
            type="select"
            options={toOption(FuelTypeEnum, getReadableFuelType)}
            numeric
            placeholder="Select fuel type"
          />
          <ParamInput
            name="transmission"
            label="Transmission"
            control={control}
            type="select"
            options={toOption(
              TransmissionTypeEnum,
              getReadableTransmissionType
            )}
            numeric
            placeholder="Select transmission"
          />
          <ParamInput
            name="engineDisplacement"
            label="Engine displacement (cc)"
            type="number"
            control={control}
            numeric
            placeholder="e.g. 1998"
          />
          <ParamInput
            name="enginePower"
            label="Engine power (HP)"
            type="number"
            control={control}
            numeric
            placeholder="e.g. 160"
          />
          <ParamInput
            name="color"
            label="Color"
            control={control}
            placeholder="e.g. Red (optional)"
          />
          <ParamInput
            name="vin"
            label="VIN"
            control={control}
            placeholder="17-character Vehicle Identification Number (optional)"
          />
        </div>
      </DetailsItem>

      <Spacer size={34} />

      {/* Offer Details */}
      <DetailsItem label="Offer Details" iconNode={<FaIdCard size={22} aria-hidden={true} focusable={false}/> }>
        <div className="form-grid">
          <ParamInput
            name="title"
            label="Title"
            control={control}
            placeholder="Enter offer title..."
            maxLength={60}
          />
          <ParamInput
            name="subtitle"
            label="Subtitle"
            control={control}
            placeholder="Enter offer subtitle... (optional)"
            maxLength={80}
          />
          <ParamInput
            name="description"
            label="Description"
            control={control}
            type="textarea"
            placeholder="Add details about your car..."
            maxLength={2000}
          />
          <ParamInput
            name="features"
            label="Features"
            control={control}
            type="multiselect"
            options={toOption(FeatureTypeEnum, getReadableFeatureType)}
            numeric
            placeholder="Select features"
          />
          <LocationPicker 
            mode={LocationPickerModeEnum.PickDirect}
            onChange={(lat, lng, name) => {
              setValue("locationLat", lat, { shouldValidate: true });
              setValue("locationLong", lng, { shouldValidate: true });
              setValue("locationName", name, { shouldValidate: true });
            }} />
          <PhotoUploader name="photosFiles" control={control} maxFiles={10} />
          <ParamInput
            name="price"
            label="Price"
            control={control}
            type="number"
            numeric
            placeholder="Enter price"
          />
          <ParamInput
            name="currency"
            label="Currency"
            control={control}
            type="select"
            options={Object.keys(CurrencyTypeEnum).map((key) => ({
              value: key,
              label: getReadableCurrencyType(
                CurrencyTypeEnum[key as keyof typeof CurrencyTypeEnum]
              ),
            }))}
            placeholder="Select currency"
          />
        </div>
      </DetailsItem>

      <div className="form-buttons">
        <BlockingLoader  isLoading={waitingForResponse}>
          <button className="main-button" type="submit">Submit Offer</button>
        </BlockingLoader>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddOfferForm;