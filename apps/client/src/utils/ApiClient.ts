import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../stores/useAuthStore";

class ApiClient {
  private static instance: ApiClient;
  private constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }
  private axiosInstance: AxiosInstance | undefined;
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(
        axios.create({
          baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    }
    return ApiClient.instance;
  }
}
