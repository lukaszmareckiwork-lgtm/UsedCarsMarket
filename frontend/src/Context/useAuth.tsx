import { createContext, useEffect, useState, useContext, type ReactNode } from "react";
import type { UserProfile } from "@models/User";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "@services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";
import type { SellerTypeEnum } from "@data/OfferProps";
import { ROUTES } from "@routes/Routes";
import { useRedirectBack } from "@helpers/useRedirectBack";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, phone: string, sellerType: SellerTypeEnum, password: string) => void;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  isLoggedIn: () => boolean;
};

type Props = {
  children: ReactNode;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { redirect } = useRedirectBack();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common.Authorization = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    username: string,
    phone: string,
    sellerType: SellerTypeEnum,
    password: string,
  ) => {
    await registerApi(username, email, phone, sellerType, password)
      .then((res) => {
        // console.log("Calling register API with:", email, password);
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            username: res?.data.userName,
            email: res?.data.email,
            id: res?.data.id,
          };

          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          axios.defaults.headers.common.Authorization = "Bearer " + res?.data.token!;
          setUser(userObj!);
          toast.success("Login success.");
          // navigate(ROUTES.HOME);
          redirect(true);
        }
      })
      .catch((e) => {
        console.error("REGISTER ERROR:", e);
        toast.warning("Server error occured");
      });
  };

  const loginUser = async (email: string, password: string) => {
    // console.log("Calling login API with:", email, password);
    await loginApi(email, password)
      .then((res) => {
        // console.log("Login response:", res);

        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            username: res?.data.userName,
            email: res?.data.email,
            id: res?.data.id,
          };

          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          axios.defaults.headers.common.Authorization = "Bearer " + res?.data.token!;
          setUser(userObj!);
          toast.success("Login success.");
          // navigate(ROUTES.HOME);
          redirect(true);
        }
      })
      .catch((e) => {
        console.error("LOGIN ERROR:", e);
        toast.warning("Server error occured");
      });
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    delete axios.defaults.headers.common.Authorization;
    toast.info("You have been logged out.");
    navigate(ROUTES.HOME);
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logoutUser, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
