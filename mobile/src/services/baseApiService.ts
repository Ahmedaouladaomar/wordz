import apiClient from "@/api/client";
import { ApiResponse } from "@/types/api";
import { AxiosInstance, AxiosRequestConfig } from "axios";

export abstract class BaseApiService {
  protected readonly http: AxiosInstance = apiClient;
  protected abstract readonly prefix: string;

  protected async handleRequest<T>(
    path: string,
    method: "get" | "post" | "put" | "patch" | "delete", // Strict method types
    payload?: any,
    options?: AxiosRequestConfig, // Allow for extra headers if needed
  ): Promise<ApiResponse<T>> {
    try {
      let response;

      const fullPath = `${this.prefix}${path}`;

      // Handle Methods correctly
      if (method === "get" || method === "delete") {
        response = await this.http[method](fullPath, {
          params: payload,
          ...options,
        });
      } else {
        // post, put, patch take (url, data, config)
        response = await this.http[method](fullPath, payload, options);
      }

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      return {
        success: false,
        message: Array.isArray(message) ? message[0] : message,
      };
    }
  }
}
