import React from "react";
import "./RegisterPage.css";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ParamInput } from "../../Components/ParamInput/ParamInput";
import { getReadableSellerType, SellerTypeEnum } from "../../Data/OfferProps";

type RegisterFormInputs = {
  username: string;
  email: string;
  phone: string;
  sellerType: number;
  password: string;
};

const validation = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required").email(),
  phone: Yup.string().required(),
  sellerType: Yup.number().required(),
  password: Yup.string().required("Password is required"),
});

const RegisterPage = () => {
  const { registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormInputs>({ resolver: yupResolver(validation) });

  const handleRegister = (form: RegisterFormInputs) => {
    console.log("Register submitted:", form);
    registerUser(form.username, form.email, form.phone, form.sellerType, form.password);
  };

  const toOption = <T extends number>(
    obj: Record<string, T>,
    getLabel: (v: T) => string
  ) =>
    Object.entries(obj)
      .filter(([_, v]) => typeof v === "number")
      .map(([_, v]) => ({ value: v as T, label: getLabel(v as T) }));

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit(handleRegister)}>
        <h2 className="login-title">Welcome!</h2>
        <p className="login-subtitle">Register your account</p>

        <div className="login-field">
          <label>Username</label>
          <input
            type="username"
            {...register("username")}
            placeholder="Enter your username"
          />
          {errors.username && (
            <span className="error-text">{errors.username.message}</span>
          )}
        </div>

        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="error-text">{errors.email.message}</span>
          )}
        </div>

        <div className="login-field">
          <label>Phone Number</label>
          <input
            type="phone"
            {...register("phone")}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <span className="error-text">{errors.phone.message}</span>
          )}
        </div>

        <ParamInput
          name="sellerType"
          label="Seller Type"
          control={control}
          type="select"
          options={toOption(SellerTypeEnum, getReadableSellerType)}
          numeric
          placeholder="Select seller type"
        />

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="error-text">{errors.password.message}</span>
          )}
        </div>

        <button className="login-btn" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
