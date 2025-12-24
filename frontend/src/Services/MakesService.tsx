import { handleError } from '../Helpers/handleError';
import axios from 'axios';
import type { GetMakesResponseDto } from '../Data/GetMakesResponseDto';
import type { GetModelsResponseDto } from '../Data/GetModelsResponseDto';

const api = "http://localhost:5261/api/makes";


export const makesGetApi = () => {
  try {
    const data = axios
      .get<GetMakesResponseDto[]>(api)
      .catch((error) => {
        console.log(`makesGetApi - error: ${error}`);
        handleError(error);
      });

    return data;
  } catch (error) {
    console.log(`makesGetApi - error: ${error}`);
    handleError(error);
  }
};

export const modelsGetApi = (makeIds: number[]) => {
  try {
    const query = makeIds.map(id => `makeIds=${id}`).join("&");
    const finalRoute = `${api}/models?${query}`;

    const data = axios
      .get<GetModelsResponseDto[]>(finalRoute)
      .catch((error) => {
        console.log(`modelsGetApi - error: ${error}`);
        handleError(error);
      });

    return data;
  } catch (error) {
    console.log(`modelsGetApi - error: ${error}`);
    handleError(error);
  }
};