import axios from "axios";
import { handleError } from "@helpers/handleError";
import type { UserProfileToken } from "@models/User";
import type { SellerTypeEnum } from "@data/OfferProps";
import { API_URL } from "@config/env";

const api = API_URL;

export const loginApi = async (email: string, password: string) =>{
    try {
        const data = await axios.post<UserProfileToken>(api + "account/login",{
            email: email,
            password: password,
        });

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const registerApi = async (email: string, username: string, phone: string, sellerType: SellerTypeEnum, password: string) =>{
    try {
        const data = await axios.post<UserProfileToken>(api + "account/register",{
            email: email,
            username: username,
            phone: phone,
            sellerType: sellerType,
            password: password,
        });

        return data;
    } catch (error) {
        handleError(error);
    }
};