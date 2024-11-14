import axios, { Axios, AxiosResponse } from "axios";

export const postNoticeApi = async <T>(api: string, param: object) => {
  //await 리턴을 promise
  try {
    const result: AxiosResponse<T> = await axios.post(api, param);
    return result;
  } catch (error) {
    alert(error);
  }
};
