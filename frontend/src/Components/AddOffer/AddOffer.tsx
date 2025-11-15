import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ParamInput } from "../ParamInput/ParamInput";
import "./AddOffer.css";
import {
  FuelTypeEnum,
  TransmissionTypeEnum,
  SellerTypeEnum,
  CurrencyTypeEnum,
  getReadableFuelType,
  getReadableTransmissionType,
  getReadableSellerType,
  getReadableCurrencyType,
  type OfferProps,
  FeatureTypeEnum,
  getReadableFeatureType,
} from "../../Data/OfferProps";
import { useMakes, type MakeData } from "../../context/MakesContext";

const AddOffer: React.FC = () => {
  const { makes } = useMakes();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { control, handleSubmit, reset, watch, setValue } = useForm<OfferProps>({
    mode: "onChange",
    defaultValues: {
      offerId: undefined,
      makeId: undefined,
      modelId: undefined,
      year: undefined,
      mileage: undefined,
      fuelType: undefined,
      engineDisplacement: undefined,
      enginePower: undefined,
      transmission: undefined,
      color: "",
      vin: "",
      title: "",
      subtitle: "",
      description: "",
      features: [],
      photos: [],
      location: "",
      sellerType: undefined,
      price: undefined,
      currency: CurrencyTypeEnum.Usd,
      createdDate: new Date(),
    },
  });

  const selectedMake = makes.find((m) => m.make_id === watch("makeId"));
  const availableModels = selectedMake ? Object.values(selectedMake.models) : [];

  const onSubmit: SubmitHandler<OfferProps> = (data) => {
    data.offerId = crypto.randomUUID();
    console.log("✅ Offer submitted:", data);
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setValue("photos", fileArray);
    setPreviewUrls(fileArray.map((f) => URL.createObjectURL(f)));
  };

  return (
    <form className="add-offer-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Add a New Offer</h2>

      {/* VEHICLE INFORMATION */}
      <section className="form-section">
        <h3>Vehicle Information</h3>
        <div className="form-grid">
          <ParamInput
            name="makeId"
            label="Make"
            control={control}
            type="select"
            options={makes.map((m) => ({ value: m.make_id, label: m.make_name }))}
            rules={{ required: "Make is required" }}
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
            rules={{ required: "Model is required" }}
          />

          <ParamInput
            name="year"
            label="Year"
            type="number"
            control={control}
            rules={{
              required: "Year is required",
              min: { value: 1900, message: "Year cannot be before 1900" },
              max: { value: new Date().getFullYear(), message: "Invalid year" },
            }}
          />

          <ParamInput
            name="mileage"
            label="Mileage (km)"
            type="number"
            control={control}
            rules={{
              required: "Mileage is required",
              min: { value: 0, message: "Mileage cannot be negative" },
            }}
          />

          <ParamInput
            name="fuelType"
            label="Fuel Type"
            control={control}
            type="select"
            options={Object.values(FuelTypeEnum).map((f) => ({
              value: f,
              label: getReadableFuelType(f),
            }))}
          />

          <ParamInput
            name="transmission"
            label="Transmission"
            control={control}
            type="select"
            options={Object.values(TransmissionTypeEnum).map((t) => ({
              value: t,
              label: getReadableTransmissionType(t),
            }))}
          />

          <ParamInput
            name="engineDisplacement"
            label="Engine Displacement (cc)"
            type="number"
            control={control}
            rules={{
              min: { value: 50, message: "Too small" },
              max: { value: 10000, message: "Too large" },
            }}
            placeholder="e.g. 1998"
          />

          <ParamInput
            name="enginePower"
            label="Engine Power (HP)"
            type="number"
            control={control}
            rules={{
              min: { value: 10, message: "Too low" },
              max: { value: 2000, message: "Too high" },
            }}
            placeholder="e.g. 160"
          />

          <ParamInput name="color" label="Color" control={control} placeholder="e.g. Red" />

          <ParamInput
            name="vin"
            label="VIN Number"
            control={control}
            placeholder="17-character Vehicle Identification Number"
            rules={{
              pattern: { value: /^[A-HJ-NPR-Z0-9]{17}$/, message: "Invalid VIN format" },
            }}
          />
        </div>
      </section>

      {/* OFFER DETAILS */}
      <section className="form-section">
        <h3>Offer Details</h3>
        <div className="form-grid">
          <ParamInput
            name="title"
            label="Title"
            control={control}
            placeholder="Enter offer title..."
            rules={{
              required: "Title is required",
              minLength: { value: 5, message: "Title too short" },
            }}
          />

          <ParamInput name="subtitle" label="Subtitle" control={control} placeholder="Enter offer subtitle..." />

          <ParamInput
            name="description"
            label="Description"
            control={control}
            type="textarea"
            placeholder="Add details about your car..."
            rules={{ minLength: { value: 20, message: "Description too short" } }}
          />

          <ParamInput
            name="features"
            label="Features"
            control={control}
            type="multiselect"
            options={Object.values(FeatureTypeEnum).map((f) => ({
              value: f,
              label: getReadableFeatureType(f),
            }))}
          />

          <div className="param-input">
            <label>Photos</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e.target.files)} />
            <div className="photo-previews">
              {previewUrls.map((url, i) => (
                <img key={i} src={url} alt={`Preview ${i}`} />
              ))}
            </div>
          </div>

          <ParamInput
            name="location"
            label="Location"
            control={control}
            placeholder="City / Region"
            rules={{ required: "Location is required" }}
          />

          <ParamInput
            name="sellerType"
            label="Seller Type"
            control={control}
            type="select"
            options={Object.values(SellerTypeEnum).map((s) => ({
              value: s,
              label: getReadableSellerType(s),
            }))}
          />

          <div className="param-input price-field">
            <ParamInput
              name="price"
              label="Price"
              type="number"
              control={control}
              rules={{
                required: "Price is required",
                min: { value: 100, message: "Too cheap to be real" },
              }}
            />
            <ParamInput
              name="currency"
              label="Currency"
              control={control}
              type="select"
              options={Object.values(CurrencyTypeEnum).map((c) => ({
                value: c,
                label: getReadableCurrencyType(c),
              }))}
            />
          </div>
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

export default AddOffer;
