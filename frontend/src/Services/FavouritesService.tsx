import axios from "axios";
import { handleError } from "@helpers/handleError";

const api = `${import.meta.env.VITE_API_URL}/favouriteoffers/`;

export type AddRemoveFavouriteResponse = {
  offerId: number;
  isFavourite: boolean;
  favouritesCount: number;
};

export const addFavouriteApi = async (offerId: number) =>{
    try {
        const data = await axios.post<AddRemoveFavouriteResponse>(api + offerId);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const removeFavouriteApi = async (offerId: number) =>{
    try {
        const data = await axios.delete<AddRemoveFavouriteResponse>(api + offerId);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const getFavouritesCountApi = async () =>{
    try {
        const data = await axios.get<number>(api + "count");
        return data;
    } catch (error) {
        handleError(error);
    }
};