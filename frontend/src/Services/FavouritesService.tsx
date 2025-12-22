import axios from "axios";
import { handleError } from "../Helpers/handleError";

const api = "http://localhost:5261/api/favouriteoffers/";

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