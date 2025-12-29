import "./LoginPage.css";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ParamInput } from "../../Components/ParamInput/ParamInput";
import BlockingLoader from "../../Components/BlockingLoader/BlockingLoader";
import { useState } from "react";
import SEO from "../../Components/SEO/SEO";

type LoginFormInputs = {
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters long"),
});

const LoginPage = () => {
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(validation),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleLogin = async (form: LoginFormInputs) => {
    try {
      setLoading(true);
      await loginUser(form.email, form.password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <SEO title="Login — Used Cars Market" description="Login to your Used Cars Market account to manage offers and favourites." />
      <section className="login-frame">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to your account</p>
        <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
          <ParamInput
            name="email"
            label="Email"
            type="text"
            control={control}
            placeholder="Enter your email"
          />
          <ParamInput
            name="password"
            label="Password"
            type="password"
            control={control}
            placeholder="Enter your password"
          />

          <div className="login-btn-wrapper">
            <BlockingLoader isLoading={loading}>
              <button className="login-btn main-button" type="submit">
                Login
              </button>
            </BlockingLoader>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
