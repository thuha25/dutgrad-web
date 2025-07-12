import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { clearAuthTokens, clearAuthUser, getAccessToken } from "./auth";
import { ApiResponse } from "@/schemas/api";
import { APP_ROUTES } from "./constants";

const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
const apiBaseUrl =
  (typeof window == "undefined" && process.env.NEXT_PUBLIC_SSR_API_URL) ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";
const baseURL = `${apiBaseUrl}/${apiVersion}`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAuthTokens();
      clearAuthUser();
      if (typeof window !== "undefined") {
        window.location.href = APP_ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.get<ApiResponse<T>>(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.post<ApiResponse<T>>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.put<ApiResponse<T>>(url, data, config);
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.patch<ApiResponse<T>>(url, data, config);
  },

  head: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.head<T>(url, config);
  },

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.delete<ApiResponse<T>>(url, config);
  },

  instance: api,
};
