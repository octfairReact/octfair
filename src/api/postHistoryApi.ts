import axios, { AxiosResponse } from "axios";

export const postHistoryApi = async <T>(api: string, param: object) => {
  try {
    const result: AxiosResponse<T> = await axios.post(api, param);
    return result;
  } catch (error) {
    alert(error);
    throw error;
  }
};
