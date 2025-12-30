import * as Yup from "yup";
import { emailField, passwordField } from "./commonFields";

export const registerValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .matches(
      /^[a-zA-Z][a-zA-Z0-9._]*$/,
      "Username must start with a letter and contain only letters, numbers, dots, or underscores"
    )
    .matches(
      /^(?!.*[._]{2})/,
      "Username cannot contain consecutive dots or underscores"
    )
    .matches(/[^._]$/, "Username cannot end with a dot or underscore"),

  email: emailField,

  phone: Yup.string()
    .required("Phone number is required")
    .transform((value) => value.replace(/[^\d+]/g, ""))
    .matches(/^\+?[1-9]\d{6,14}$/, "Enter a valid phone number"),

  sellerType: Yup.number().required(),

  password: passwordField,
});