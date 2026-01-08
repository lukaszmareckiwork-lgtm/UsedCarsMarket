import axios, { type AxiosResponse } from "axios";
import type { OfferProps } from "@data/OfferProps";
import { handleError } from "@helpers/handleError";
import type { PagedResult } from "@helpers/PagedResult";
import type { CreateOfferRequestDto } from "@data/CreateOfferRequestDto";
import type { OfferQueryObject } from "@data/OfferQueryObject";
import type { CreateOfferResponseDto } from "@data/CreateOfferResponseDto";
import type { DeleteOfferResponseDto } from "@data/DeleteOfferResponseDto";

const api = `${import.meta.env.VITE_API_URL}/offer/`;

export function buildOfferQueryString(query: OfferQueryObject): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) return;
    if (key == "OnlyFavourites") return;

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

function normalizeOfferDate(o: OfferProps): OfferProps {
    return {
      ...o,
      createdDate: new Date(o.createdDate),
    };
  }

function normalizeOffersDates(promise: Promise<void | AxiosResponse<PagedResult<OfferProps>, any, {}>>){
  return promise.then(res => {
    if(res?.data != undefined){
      const offers = res.data.items!.map(normalizeOfferDate) ?? [];
      res.data.items = offers;
    }})
  };

export const offerPostApi = async (offer: CreateOfferRequestDto) => {
  try {
    const formData = new FormData();

     // Define fields that need 2-decimal formatting
    const twoDecimalFields = new Set(["engineDisplacement", "price"]);
    const intactNumberFields = new Set(["locationLat", "locationLong"]);

    // Append ALL primitive properties
    Object.entries(offer).forEach(([key, value]) => {
      if (key === "photosFiles" || key === "Features") return; // handled separately
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) return;

      if (typeof value === "number") {
        if (twoDecimalFields.has(key)) {
          formData.append(key, value.toFixed(2));
        } else if(intactNumberFields.has(key)) {
          formData.append(key, value.toString());
        }  else {
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

    const response = await axios.post<CreateOfferResponseDto>(api, formData, {
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

export const offerDeleteApi = async (offerId: number) =>{
    try {
        const response = await axios.delete<DeleteOfferResponseDto>(api + offerId);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const offerPreviewGetApi = (queryObj: OfferQueryObject) => {
  try {
    const favourites = queryObj.OnlyFavourites ? "/favourites" : "";
    const query = buildOfferQueryString(queryObj);

    const finalRoute = `${api}preview${favourites}?${query}`;

    console.log(`offerGetApi - finalRoute: ${finalRoute}`);
    const data = axios
      .get<PagedResult<OfferProps>>(finalRoute)
      .catch((error) => {
        console.log(`offerGetApi - error: ${error}`);
        handleError(error);
      });

    normalizeOffersDates(data);
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

export const getUserOffersCountApi = async () =>{
    try {
        const data = await axios.get<number>(api + "userofferscount");
        return data;
    } catch (error) {
        handleError(error);
    }
};
