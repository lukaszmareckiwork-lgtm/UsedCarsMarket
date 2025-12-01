import axios from "axios";
import type { OfferProps } from "../Data/OfferProps";
import { handleError } from "../Helpers/ErrorHandler";
import type { PagedResult } from "../Helpers/PagedResult";
import type { CreateOfferRequestDto } from "../Data/CreateOfferRequestDto";

const api = "http://localhost:5261/api/offer/";

const getOfferFiltersQuery = (pageNumber: number, pageSize: number, makeIds: number[], modelIds: number[]) =>{
  const paginationQuery = `PageNumber=${pageNumber}&PageSize=${pageSize}`;
  const makesQuery = makeIds.length ? `&MakeIds=${makeIds.join("&MakeIds=")}` : "";
  const modelsQuery = modelIds.length ? `&ModelIds=${modelIds.join("&ModelIds=")}` : "";

  const query = `${paginationQuery}${makesQuery}${modelsQuery}`;
  return query;
}

export const offerPostApi = async (offer: CreateOfferRequestDto) => {
  try {
    const formData = new FormData();

     // Define fields that need 2-decimal formatting
    const twoDecimalFields = new Set(["engineDisplacement", "price"]);

    // Append ALL primitive properties
    Object.entries(offer).forEach(([key, value]) => {
      if (key === "photosFiles" || key === "Features") return; // handled separately
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) return;

      if (typeof value === "number") {
        if (twoDecimalFields.has(key)) {
          formData.append(key, value.toFixed(2));
        } else {
          formData.append(key, Math.floor(value).toString()); // integer, enums, IDs
        }
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString()); // ISO string
      } else {
        formData.append(key, value.toString());
      }
    });

    // Features array (multiple FormData entries)
    if (offer.features) {
      offer.features.forEach(f => formData.append("Features", f.toString()));
    }

    // Append files for the `files` parameter
    if (offer.photosFiles && offer.photosFiles.length > 0) {
      offer.photosFiles.forEach(file => {
        formData.append("files", file, file.name);
      });
    }

    // console.log(`formData: ${Array.from(formData.entries()).map(([k, v]) => `${k}: ${v instanceof File ? v.name : v}`).join(", ") }`);

    const response = await axios.post(api, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;

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
