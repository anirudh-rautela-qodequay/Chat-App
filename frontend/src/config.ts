interface BaseApi {
  baseUrl: string;
}

const baseApi: BaseApi = {
  baseUrl: import.meta.env.VITE_REACT_APP_BASE_URL as string,
};

export default baseApi;
