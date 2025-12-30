import * as Yup from "yup";
import { emailField, passwordField } from "./commonFields";

export const loginValidationSchema = Yup.object().shape({
  email: emailField,
  password: passwordField,
});