import axios from "axios";
import type { OfferProps } from "../Data/OfferProps";
import { handleError } from "../Helpers/ErrorHandler";

const api = "http://localhost:5261/api/offer/";

export const offerPostApi =  ( offerProps: OfferProps ) =>{
    try {
        const data = axios.post<OfferProps>(api, offerProps, {
            headers :{
                Authorization : `Bearer ${localStorage.getItem("token")}`,
            }
        });
        
        return data;
    } catch (error) {
        handleError(error);
    }
}