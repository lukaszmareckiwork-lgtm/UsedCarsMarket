import React from "react";
import "./LoginPage.css";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type LoginFormInputs = {
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required").email(),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const { loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormInputs) =>{
    console.log("Login submitted:", form);
    loginUser(form.email, form.password);
  };

  return (
     <div className="login-container">
    <form className="login-card" onSubmit={handleSubmit(handleLogin)}>
      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">Login to your account</p>

      <div className="login-field">
        <label>Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email"
        />
        {errors.email && <span className="error-text">{errors.email.message}</span>}
      </div>

      <div className="login-field">
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="Enter your password"
        />
        {errors.password && <span className="error-text">{errors.password.message}</span>}
      </div>

      <button className="login-btn" type="submit">
        Login
      </button>
    </form>
  </div>
  )
};

export default LoginPage;
