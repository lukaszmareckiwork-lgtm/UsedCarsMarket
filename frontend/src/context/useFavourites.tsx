import { createContext, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  addFavouriteApi,
  getFavouritesCountApi,
  removeFavouriteApi,
} from "../Services/FavouritesService";
import { toast } from "react-toastify";
import React from "react";

type FavouritesContextType = {
  favouritesCount: number;
  addFavourite: (offerId: number) => void;
  removeFavourite: (offerId: number) => void;
};

type Props = {
  children: React.ReactNode;
};

const FavouritesContext = createContext<FavouritesContextType>({} as FavouritesContextType);

export const FavouritesProvider = ({ children }: Props) => {
  const [count, setCount] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn()) {
      setCount(0);
      return;
    } else {
      getFavouritesCount()?.then((res) => {
        setCount(res ?? 0);
        setIsReady(true);
      });
    }
  }, [isLoggedIn()]);

  const addFavourite = async (offerId: number) => {
    await addFavouriteApi(offerId)
      .then((res) => {
        // console.log("addFavourite response:", res);

        if (res) {
          setCount(res?.data.favouritesCount);
          toast.success("Offer added to favourites.");
        }
      })
      .catch((e) => {
        console.error("ADD FAVOURITE ERROR:", e);
        toast.warning("Server error occured");
      });
  };

  const removeFavourite = async (offerId: number) => {
    await removeFavouriteApi(offerId)
      .then((res) => {
        // console.log("removeFavourite response:", res);

        if (res) {
          setCount(res?.data.favouritesCount);
          toast.success("Offer removed from favourites.");
        }
      })
      .catch((e) => {
        console.error("REMOVE FAVOURITE ERROR:", e);
        toast.warning("Server error occured");
      });
  };

  const getFavouritesCount = async () => {
    var favCount = await getFavouritesCountApi()
      .then((res) => {
        console.log("getFavouritesCount response:", res);

        return res?.data;
      })
      .catch((e) => {
        console.error("GET FAVOURITES COUNT ERROR:", e);
        toast.warning("Server error occured");
        return 0;
      });
    
    return favCount;
  };

  return (
    <FavouritesContext.Provider
      value={{
        favouritesCount: count,
        addFavourite,
        removeFavourite,
      }}
    >
      {isReady ? children : null}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => React.useContext(FavouritesContext);