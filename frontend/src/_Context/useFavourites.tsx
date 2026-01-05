import { createContext, useEffect, useState, useContext, type ReactNode } from "react";
import { useAuth } from "./useAuth";
import {
  addFavouriteApi,
  getFavouritesCountApi,
  removeFavouriteApi,
} from "@services/FavouritesService";
import { toast } from "react-toastify";

const addedSet = new Set<number>();
const removedSet = new Set<number>();

type FavouritesContextType = {
  favouritesCount: number;
  isFavourite: (offerId: number, initial: boolean) => boolean;
  addFavourite: (offerId: number) => void;
  removeFavourite: (offerId: number) => void;
};

type Props = {
  children: ReactNode;
};

const FavouritesContext = createContext<FavouritesContextType>({} as FavouritesContextType);

export const FavouritesProvider = ({ children }: Props) => {
  const [count, setCount] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  const { isLoggedIn } = useAuth();

  const logged = isLoggedIn();

  useEffect(() => {
    // console.log(`Logged useEffect   logged:${logged}    count:${count}`);
    if (!logged) {
      setCount(0);
      addedSet.clear();
      removedSet.clear();
      setIsReady(true);
      return;
    } 

    getFavouritesCount()?.then((res) => {
      setCount(res ?? 0);
      setIsReady(true);
    }); 
  }, [logged]);

  const isFavourite = (offerId: number, initial: boolean) => {
    if (!logged) return false;
    if (addedSet.has(offerId)) return true;
    if (removedSet.has(offerId)) return false;
    return initial;
  };

  const addFavourite = async (offerId: number) => {
    await addFavouriteApi(offerId)
      .then((res) => {
        // console.log("addFavourite response:", res);
        if (!res) return;

        addedSet.add(offerId);
        removedSet.delete(offerId);

        setCount(res?.data.favouritesCount);
        toast.success("Offer added to favourites.");
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
        if (!res) return;

        removedSet.add(offerId);
        addedSet.delete(offerId);

        setCount(res?.data.favouritesCount);
        toast.success("Offer removed from favourites.");
      })
      .catch((e) => {
        console.error("REMOVE FAVOURITE ERROR:", e);
        toast.warning("Server error occured");
      });
  };

  const getFavouritesCount = async () => {
    // console.log(`getFavouritesCount    logged:${logged}`);

    var favCount = await getFavouritesCountApi()
      .then((res) => {
        // console.log("getFavouritesCount response:", res);

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
        isFavourite,
        addFavourite,
        removeFavourite,
      }}
    >
      {isReady ? children : null}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => useContext(FavouritesContext);