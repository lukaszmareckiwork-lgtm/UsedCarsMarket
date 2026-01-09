import "./LoginPage.css";
import { useAuth } from "@context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ParamInput } from "@components/ParamInput/ParamInput";
import BlockingLoader from "@components/BlockingLoader/BlockingLoader";
import { useState } from "react";
import SEO from "@components/SEO/SEO";
import { loginValidationSchema } from "@validation/loginValidationSchema";
import DemoComment from "@components/DemoComment/DemoComment";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginValidationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
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
      <SEO
        title="Login — Used Cars Market"
        description="Login to your Used Cars Market account to manage offers and favourites."
      />
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

          <DemoComment
            textContent={`You can use demo account for testing.`}
            showButton={true}
            onButtonClicked={() => {
              setValue("email", "demo@usedcarsmarket.com");
              setValue("password", "demopass");
            }}
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
