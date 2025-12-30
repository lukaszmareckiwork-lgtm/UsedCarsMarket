import { createContext, useEffect, useState, useContext, type ReactNode } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";
import {
  getUserOffersCountApi,
  offerDeleteApi,
  offerPostApi,
} from "../Services/OfferService";
import type { CreateOfferRequestDto } from "../Data/CreateOfferRequestDto";
import type { OfferProps } from "../Data/OfferProps";

type UserOffersContextType = {
  userOffersCount: number;
  addOffer: (request: CreateOfferRequestDto) => Promise<OfferProps>;
  deleteOffer: (offerId: number) => Promise<number>;
};

type Props = {
  children: ReactNode;
};

const UserOffersContext = createContext<UserOffersContextType>(
  {} as UserOffersContextType
);

export const UserOffersProvider = ({ children }: Props) => {
  const [count, setCount] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  const { isLoggedIn } = useAuth();

  const logged = isLoggedIn();

  useEffect(() => {
    // console.log(`Logged useEffect   logged:${logged}    count:${count}`);
    if (!logged) {
      setCount(0);
      setIsReady(true);
      return;
    }

    getUserOffersCount()?.then((res) => {
      setCount(res ?? 0);
      setIsReady(true);
    });
  }, [logged]);

  const addOffer = async (request: CreateOfferRequestDto) => {
    const res = await offerPostApi(request);

    console.log("addOffer response:", res);

    if (!res || typeof res.userOffersCount !== "number") {
        throw new Error("Invalid server response");
    }

    setCount(res.userOffersCount);
    return res.offerDto;
  };

//   const addOffer = async (request: CreateOfferRequestDto) => {
//     const res = await offerPostApi(request);

//     console.log("addOffer response:", res);

//     // if (!res?.data) {
//     //     throw new Error("Invalid server response");
//     // }

//     setCount(res.data.userOffersCount);
//     return res.data;

//     // await offerPostApi(request)
//     //   .then((res) => {
//     //     // console.log("addFavourite response:", res);
//     //     if (!res) return;

//     //     setCount(res?.data.userOffersCount);
//     //     toast.success("Offer created successfully!");
//     //   })
//     //   .catch((e) => {
//     //     console.error("ADD OFFER ERROR:", e);
//     //     toast.warning("Server error occured");
//     //   });
//   };

  const deleteOffer = async (offerId: number) => {
    const res = await offerDeleteApi(offerId);

    if (!res || typeof res.userOffersCount !== "number") {
        throw new Error("Invalid server response");
    }

    setCount(res.userOffersCount);
    return res.offerId;

    // await deleteOfferApi(offerId)
    //   .then((res) => {
    //     // console.log("removeFavourite response:", res);
    //     if (!res) return;

    //     setCount(res?.data.userOffersCount);
    //     toast.success("Offer deleted.");
    //   })
    //   .catch((e) => {
    //     console.error("DELETE OFFER ERROR:", e);
    //     toast.warning("Server error occured");
    //   });
  };

  const getUserOffersCount = async () => {
    // console.log(`getUserOffersCount    logged:${logged}`);

    var count = await getUserOffersCountApi()
      .then((res) => {
        // console.log("getUserOffersCount response:", res);
        return res?.data;
      })
      .catch((e) => {
        console.error("GET USER OFFERS COUNT ERROR:", e);
        toast.warning("Server error occured");
        return 0;
      });

    return count;
  };

  return (
    <UserOffersContext.Provider
      value={{
        userOffersCount: count,
        addOffer,
        deleteOffer,
      }}
    >
      {isReady ? children : null}
    </UserOffersContext.Provider>
  );
};

export const useUserOffers = () => useContext(UserOffersContext);
