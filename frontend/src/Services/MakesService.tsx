import { handleError } from '@helpers/handleError';
import type { GetMakesResponseDto } from '@data/GetMakesResponseDto';
import type { GetModelsResponseDto } from '@data/GetModelsResponseDto';
import { API_URL } from '@config/env';
import { apiClient } from '@helpers/apiClient';

const api = `${API_URL}/makes`;


export const makesGetApi = () => {
  try {
    const data = apiClient
      .get<GetMakesResponseDto[]>(api)
      .catch((error) => {
        if (process.env.NODE_ENV === "development") console.log(`makesGetApi - error: ${error}`);
        handleError(error);
      });

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.log(`makesGetApi - error: ${error}`);
    handleError(error);
  }
};

export const modelsGetApi = (makeIds: number[]) => {
  try {
    const query = makeIds.map(id => `makeIds=${id}`).join("&");
    const finalRoute = `${api}/models?${query}`;

    const data = apiClient
      .get<GetModelsResponseDto[]>(finalRoute)
      .catch((error) => {
        if (process.env.NODE_ENV === "development") console.log(`modelsGetApi - error: ${error}`);
        handleError(error);
      });

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.log(`modelsGetApi - error: ${error}`);
    handleError(error);
  }
};