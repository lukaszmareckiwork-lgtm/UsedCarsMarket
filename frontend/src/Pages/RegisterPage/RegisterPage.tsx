import "./RegisterPage.css";
import { useAuth } from "@context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ParamInput } from "@components/ParamInput/ParamInput";
import { getReadableSellerType, SellerTypeEnum } from "@data/OfferProps";
import BlockingLoader from "@components/BlockingLoader/BlockingLoader";
import { useState } from "react";
import SEO from "@components/SEO/SEO";
import { registerValidationSchema } from "@validation/registerValidationSchema";

type RegisterFormInputs = {
  username: string;
  email: string;
  phone: string;
  sellerType: number;
  password: string;
};

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
  } = useForm<RegisterFormInputs>({ 
    resolver: yupResolver(registerValidationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      sellerType: 0,
      password: "",
    },
   });

  const handleRegister = async (form: RegisterFormInputs) => {
    try {
      setLoading(true);
      await registerUser(
        form.username,
        form.email,
        form.phone,
        form.sellerType,
        form.password
      );
    } finally {
      setLoading(false);
    }
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
      <SEO title="Register — Used Cars Market" description="Create a Used Cars Market account to publish and manage your vehicle offers." />
      <section className="login-frame">
        <h2 className="login-title">Welcome!</h2>
        <p className="login-subtitle">Register your account</p>
        <form className="login-form" onSubmit={handleSubmit(handleRegister)}>
          <ParamInput
            name="username"
            label="Username"
            type="text"
            control={control}
            placeholder="Enter your username"
          />
          <ParamInput
            name="email"
            label="Email"
            type="text"
            control={control}
            placeholder="Enter your email"
          />
          <ParamInput
            name="phone"
            label="Phone Number"
            type="tel"
            control={control}
            placeholder="Enter your phone number"
          />
          <ParamInput
            name="sellerType"
            label="Seller Type"
            type="select"
            control={control}
            options={toOption(SellerTypeEnum, getReadableSellerType)}
            numeric
            placeholder="Select seller type"
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
                Register
              </button>
            </BlockingLoader>
          </div>
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;
