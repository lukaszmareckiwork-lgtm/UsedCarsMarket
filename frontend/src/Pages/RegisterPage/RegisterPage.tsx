import React from "react";
import "./RegisterPage.css";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required").email(),
  password: Yup.string().required("Password is required"),
});

const RegisterPage = () => {
  const { registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({ resolver: yupResolver(validation) });

  const handleRegister = (form: RegisterFormInputs) => {
    console.log("Register submitted:", form);
    registerUser(form.username, form.email, form.password);
  };

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
