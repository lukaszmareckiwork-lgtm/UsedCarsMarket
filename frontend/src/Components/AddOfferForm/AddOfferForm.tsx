import { useForm, type SubmitHandler } from "react-hook-form";
import { ParamInput } from "../ParamInput/ParamInput";
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
} from "../../Data/OfferProps";
import { useMakes } from "../../Context/MakesContext";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreateOfferRequestDto } from "../../Data/CreateOfferRequestDto";
import { PhotoUploader } from "../PhotoUploader/PhotoUploader";
import { LocationPicker } from "../LocationPicker/LocationPicker";

interface Props {
  handleOfferFormSubmit: (newOffer: CreateOfferRequestDto) => void;
}

export const validation = Yup.object().shape({
  makeId: Yup.number().required("Make is required").min(1, "Select a make"),
  modelId: Yup.number().required("Model is required").min(1, "Select a model"),
  year: Yup.number()
    .typeError("Year must be a number")
    .integer("Year must be a whole number")
    .required("Year is required")
    .min(1900, "Year must be >= 1900")
    .max(
      new Date().getFullYear(),
      `Year cannot exceed ${new Date().getFullYear()}`
    )
    .transform((value, originalValue) => {
      // If the incoming value is a string and empty → convert to null
      if (typeof originalValue === "string" && originalValue.trim() === "") {
        return null;
      }
      return value;
    }),
  mileage: Yup.number()
    .typeError("Mileage must be a number")
    .integer("Mileage must be a whole number")
    .min(0, "Mileage cannot be negative")
    .nullable()
    .transform((value, originalValue) => {
      // If the incoming value is a string and empty → convert to null
      if (typeof originalValue === "string" && originalValue.trim() === "") {
        return null;
      }
      return value;
    })
    .required("Mileage is required"),
  enginePower : Yup.number()
    .typeError("Engine power must be a number")
    .integer("Engine power must be a whole number")
    .min(0, "Engine power cannot be negative")
    .nullable()
    .transform((value, originalValue) => {
      // If the incoming value is a string and empty → convert to null
      if (typeof originalValue === "string" && originalValue.trim() === "") {
        return null;
      }
      return value;
    })
    .required("Engine power is required"),
  fuelType: Yup.number().required("Fuel type is required"),
  transmission: Yup.number().required("Transmission is required"),
  engineDisplacement: Yup.number()
    .transform((_, originalValue) => {
      if (originalValue === undefined || originalValue === null) return undefined;

      // If already a number, just round it
      if (typeof originalValue === "number" && !Number.isNaN(originalValue)) {
        return Number(originalValue.toFixed(2));
      }

      // Normalize string: replace comma with dot, remove spaces
      const normalized = String(originalValue).trim().replace(/\s+/g, "").replace(",", ".");
      const num = parseFloat(normalized);

      if (Number.isNaN(num)) return undefined;
      return Number(num.toFixed(2));
    })
    .typeError("Engine displacement must be a number")
    .required("Engine displacement is required"),
  color: Yup.string().nullable(),
  vin: Yup.string()
    .nullable()
    .notRequired()
    .test(
      "vin-format",
      "VIN must be exactly 17 characters",
      (value) => !value || /^[A-HJ-NPR-Z0-9]{17}$/.test(value)
    ),
  title: Yup.string().required("Title is required").min(5, "Title too short").max(60, "Title too long"),
  subtitle: Yup.string().required("Subtitle is required").min(5, "Subtitle too short").max(80, "Subtitle too long").nullable(),
  description: Yup.string().nullable().min(20, "Description too short").max(2000, "Description too long"),
  locationName: Yup.string(),
  locationLat: Yup.number().required("Latitude is required"),
  locationLong: Yup.number().required("Longitude is required"),
  price: Yup.number()
    .required("Price is required")
    .transform((_, originalValue) => {
      if (originalValue === undefined || originalValue === null) return undefined;

      // If already a number, just round it
      if (typeof originalValue === "number" && !Number.isNaN(originalValue)) {
        return Number(originalValue.toFixed(2));
      }

      // Normalize string: replace comma with dot, remove spaces
      const normalized = String(originalValue).trim().replace(/\s+/g, "").replace(",", ".");
      const num = parseFloat(normalized);

      if (Number.isNaN(num)) return undefined;
      return Number(num.toFixed(2));
    })
    .min(100, "Too cheap to be real"),
  photos: Yup.array().of(Yup.mixed<File>()).nullable(),
});

const AddOfferForm = ({ handleOfferFormSubmit }: Props) => {
  const { makes } = useMakes();

  const { control, handleSubmit, reset, watch, setValue } = useForm<CreateOfferRequestDto>(
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
      resolver: yupResolver(validation) as any,
    }
  );

  const selectedMake = makes.find((m) => m.make_id === watch("makeId"));
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
      <h2>Add a New Offer</h2>

      {/* Vehicle Information */}
      <section className="form-section">
        <h3>Vehicle Information</h3>
        <div className="form-grid">
          <ParamInput
            name="makeId"
            label="Make"
            control={control}
            type="select"
            options={makes.map((m) => ({
              value: m.make_id,
              label: m.make_name,
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
              value: m.model_id,
              label: m.model_name,
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
      </section>

      {/* Offer Details */}
      <section className="form-section">
        <h3>Offer Details</h3>
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
            mapboxToken={import.meta.env.VITE_MAPBOX_TOKEN || ""}
            onChange={(lat, lng, name) => {
              setValue("locationLat", lat, { shouldValidate: true });
              setValue("locationLong", lng, { shouldValidate: true });
              setValue("locationName", name, { shouldValidate: true});
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
      </section>

      <div className="form-buttons">
        <button type="submit">Submit Offer</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddOfferForm;
