import { handleError } from "@helpers/handleError";
import { API_URL } from "@config/env";
import { apiClient } from "@helpers/apiClient";

const api = `${API_URL}/favouriteoffers/`;

export type AddRemoveFavouriteResponse = {
  offerId: number;
  isFavourite: boolean;
  favouritesCount: number;
};

export const addFavouriteApi = async (offerId: number) =>{
    try {
        const data = await apiClient.post<AddRemoveFavouriteResponse>(api + offerId);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const removeFavouriteApi = async (offerId: number) =>{
    try {
        const data = await apiClient.delete<AddRemoveFavouriteResponse>(api + offerId);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const getFavouritesCountApi = async () =>{
    try {
        const data = await apiClient.get<number>(api + "count");
        return data;
    } catch (error) {
        handleError(error);
    }
};