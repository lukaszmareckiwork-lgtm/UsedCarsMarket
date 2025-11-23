import axios from "axios";
import type { OfferProps } from "../Data/OfferProps";
import { handleError } from "../Helpers/ErrorHandler";
import type { PagedResult } from "../Helpers/PagedResult";

const api = "http://localhost:5261/api/offer/";

export const offerPostApi = (offerProps: OfferProps) => {
  try {
    const data = axios.post<OfferProps>(api, offerProps, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return data;
  } catch (error) {
    handleError(error);
  }
};

export const offerGetApi = (makeIds: number[], modelIds: number[]) => {
  try {
    const makesQuery = makeIds.length ? `MakeIds=${makeIds.join("&MakeIds=")}` : "";
    const modelsQuery = modelIds.length ? `ModelIds=${modelIds.join("&ModelIds=")}` : "";

    const query = `${makesQuery}${modelsQuery}`;

    console.log(`offerGetApi - query: ${api}${query}`);
    const data = axios.get<PagedResult<OfferProps>>(`${api}?${query}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};
