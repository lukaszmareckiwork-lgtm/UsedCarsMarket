import axios from "axios";
import type { OfferProps } from "../Data/OfferProps";
import { handleError } from "../Helpers/ErrorHandler";
import type { PagedResult } from "../Helpers/PagedResult";

const api = "http://localhost:5261/api/offer/";

const getOfferFiltersQuery = (pageNumber: number, pageSize: number, makeIds: number[], modelIds: number[]) =>{
  const paginationQuery = `PageNumber=${pageNumber}&PageSize=${pageSize}`;
  const makesQuery = makeIds.length ? `&MakeIds=${makeIds.join("&MakeIds=")}` : "";
  const modelsQuery = modelIds.length ? `&ModelIds=${modelIds.join("&ModelIds=")}` : "";

  const query = `${paginationQuery}${makesQuery}${modelsQuery}`;
  return query;
}

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

export const offerGetApi = (pageNumber: number, pageSize: number, makeIds: number[], modelIds: number[]) => {
  try {
    const query = getOfferFiltersQuery(pageNumber, pageSize, makeIds, modelIds);

    console.log(`offerGetApi - query: ${api}${query}`);
    const data = axios
      .get<PagedResult<OfferProps>>(`${api}?${query}`)
      .catch((error) => {
        console.log(`offerGetApi - error: ${error}`);
        handleError(error);
      });

    return data;
  } catch (error) {
    console.log(`offerGetApi - error: ${error}`);
    handleError(error);
  }
};

export const offerPreviewGetApi = (pageNumber: number, pageSize: number, makeIds: number[], modelIds: number[]) => {
  try {
    const query = getOfferFiltersQuery(pageNumber, pageSize, makeIds, modelIds);

    console.log(`offerGetApi - query: ${api}${query}`);
    const data = axios
      .get<PagedResult<OfferProps>>(`${api}preview?${query}`)
      .catch((error) => {
        console.log(`offerGetApi - error: ${error}`);
        handleError(error);
      });

    return data;
  } catch (error) {
    console.log(`offerGetApi - error: ${error}`);
    handleError(error);
  }
};

export const offerGetSingleApi = (offerId: number) => {
  try { 
    console.log(`offerGetSingleApi - :${api}${offerId}`);

    const data = axios
      .get<OfferProps>(`${api}${offerId}`)
      .catch((error) => {
        console.log(`offerGetApi - error: ${error}`);
        handleError(error);
      });

    return data;
  } catch (error) {
    console.log(`offerGetApi - error: ${error}`);
    handleError(error);
  }
};
