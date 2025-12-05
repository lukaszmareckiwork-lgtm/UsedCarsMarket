import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";

const api = "http://localhost:5261/api/";

export type AddRemoveFavouriteResponse = {
  offerId: number;
  isFavourite: boolean;
  favouritesCount: number;
};

export const addFavouriteApi = async (offerId: number) =>{
    try {
        const data = await axios.post<AddRemoveFavouriteResponse>(api + "favouriteoffers/" + offerId);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const removeFavouriteApi = async (offerId: number) =>{
    try {
        const data = await axios.delete<AddRemoveFavouriteResponse>(api + "favouriteoffers/" + offerId);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const getFavouritesCountApi = async () =>{
    try {
        const data = await axios.get<number>(api + "favouriteoffers/count");
        return data;
    } catch (error) {
        handleError(error);
    }
};