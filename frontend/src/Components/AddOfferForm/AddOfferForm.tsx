import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ParamInput } from "../ParamInput/ParamInput";
import "./AddOfferForm.css";
import {
  FuelTypeEnum,
  TransmissionTypeEnum,
  SellerTypeEnum,
  CurrencyTypeEnum,
  getReadableFuelType,
  getReadableTransmissionType,
  getReadableSellerType,
  getReadableCurrencyType,
  FeatureTypeEnum,
  getReadableFeatureType,
  type OfferProps,
} from "../../Data/OfferProps";
import { useMakes } from "../../context/MakesContext";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface Props {
  handleOfferFormSubmit: (newOffer: OfferProps) => void;
}

export const validation = Yup.object().shape({
  makeId: Yup.number().required("Make is required").min(1, "Select a make"),
  modelId: Yup.number().required("Model is required").min(1, "Select a model"),
  year: Yup.number()
    .required("Year is required")
    .min(1900, "Year must be >= 1900")
    .max(
      new Date().getFullYear(),
      `Year cannot exceed ${new Date().getFullYear()}`
    ),
  mileage: Yup.number()
    .required("Mileage is required")
    .min(0, "Mileage cannot be negative"),
  fuelType: Yup.number().required("Fuel type is required"),
  transmission: Yup.number().required("Transmission is required"),
  engineDisplacement: Yup.number().required("Engine displacement is required"),
  enginePower: Yup.number().required("Engine power is required"),
  color: Yup.string().nullable(),
  vin: Yup.string()
    .nullable()
    .notRequired()
    .test(
      "vin-format",
      "VIN must be exactly 17 characters",
      (value) => !value || /^[A-HJ-NPR-Z0-9]{17}$/.test(value)
    ),
  title: Yup.string().required("Title is required").min(5, "Title too short"),
  subtitle: Yup.string().required("Subtitle is required").min(5, "Subtitle too short").nullable(),
  description: Yup.string().nullable().min(20, "Description too short"),
  location: Yup.string().required("Location is required"),
  price: Yup.number()
    .required("Price is required")
    .min(100, "Too cheap to be real"),
  photos: Yup.array().of(Yup.mixed<File>()).nullable(),
});

const AddOfferForm = ({ handleOfferFormSubmit }: Props) => {
  const { makes } = useMakes();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { control, handleSubmit, reset, watch, setValue } = useForm<OfferProps>(
    {
      mode: "onChange",
      defaultValues: {
        offerId: "",
        makeId: 0,
        modelId: 0,
        year: new Date().getFullYear(),
        mileage: 0,
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
        photos: [],
        location: "",
        sellerType: SellerTypeEnum.Private,
        price: 0,
        currency: CurrencyTypeEnum.Usd,
        createdDate: new Date(),
      },
      resolver: yupResolver(validation) as any,
    }
  );

  const selectedMake = makes.find((m) => m.make_id === watch("makeId"));
  const availableModels = selectedMake
    ? Object.values(selectedMake.models)
    : [];

  const onSubmit: SubmitHandler<OfferProps> = (data) => {
    data.offerId = crypto.randomUUID();
    handleOfferFormSubmit(data);
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setValue("photos", arr);
    setPreviewUrls(arr.map((f) => URL.createObjectURL(f)));
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
            placeholder="e.g. Red"
          />
          <ParamInput
            name="vin"
            label="VIN"
            control={control}
            placeholder="17-character Vehicle Identification Number"
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
          />
          <ParamInput
            name="subtitle"
            label="Subtitle"
            control={control}
            placeholder="Enter offer subtitle..."
          />
          <ParamInput
            name="description"
            label="Description"
            control={control}
            type="textarea"
            placeholder="Add details about your car..."
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
          <ParamInput
            name="location"
            label="Location"
            control={control}
            placeholder="City / Region"
          />
          <ParamInput
            name="sellerType"
            label="Seller Type"
            control={control}
            type="select"
            options={toOption(SellerTypeEnum, getReadableSellerType)}
            numeric
            placeholder="Select seller type"
          />
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
