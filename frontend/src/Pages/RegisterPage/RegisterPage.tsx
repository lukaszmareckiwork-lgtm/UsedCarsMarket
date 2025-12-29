import "./RegisterPage.css";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ParamInput } from "../../Components/ParamInput/ParamInput";
import { getReadableSellerType, SellerTypeEnum } from "../../Data/OfferProps";
import BlockingLoader from "../../Components/BlockingLoader/BlockingLoader";
import { useState } from "react";
import SEO from "../../Components/SEO/SEO";

type RegisterFormInputs = {
  username: string;
  email: string;
  phone: string;
  sellerType: number;
  password: string;
};

const validation = Yup.object().shape({
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

  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email"),

  phone: Yup.string()
    .required("Phone number is required")
    .transform((value) => value.replace(/[^\d+]/g, ""))
    .matches(/^\+?[1-9]\d{6,14}$/, "Enter a valid phone number"),

  sellerType: Yup.number().required(),

  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters long"),
});

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
  } = useForm<RegisterFormInputs>({ 
    resolver: yupResolver(validation),
    mode: "onChange",
    reValidateMode: "onChange",
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
