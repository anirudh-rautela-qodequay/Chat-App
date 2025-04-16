import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { eventDispatcher } from "./EventDispatcher";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ContentType = "multipart/form-data" | "application/json";

type Headers = {
  "Content-Type": ContentType;
};
interface BaseApiConfigProps {
  method: HttpMethod;
  url: string;
  tokenRequired?: boolean;
  data?: Record<string, any>;
  params?: Record<string, any>;
  headers?: Headers;
}

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.log("error code>>>>>>>>", error);
    if (
      error.response &&
      (error.response.data.statusCode === 401 ||
        error.response.data.statusCode === 403)
      ) {
      eventDispatcher.authError(error.response.data.message);
    } else if (error.response && error.response.data.statusCode === 503) {
      eventDispatcher.serviceUnavailableError();
    }
    return Promise.reject(error);
  }
);

const BaseApiConfig = ({
  method,
  url,
  tokenRequired,
  data,
  params,
  headers,
}: BaseApiConfigProps): Promise<AxiosResponse<any>> => {
  const tokenData: string | null = localStorage.getItem("ChatAppToken");

  const configuration: AxiosRequestConfig = {
    method: method,
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    data:
      method === "POST" || method === "PUT" || method === "DELETE"
        ? data
        : undefined,
    params: method === "GET" ? params : undefined,
  };

  if (tokenRequired && tokenData !== "null") {
    configuration.headers!.Authorization = `Bearer ${tokenData}`;
  }

  return axiosInstance(configuration);
};

export default BaseApiConfig;
