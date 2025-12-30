import * as Yup from "yup";

export const addOfferValidationSchema = Yup.object().shape({
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
  subtitle: Yup.string().max(80, "Subtitle too long").nullable(),
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