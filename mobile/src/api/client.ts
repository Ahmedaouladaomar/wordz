import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // If your NestJS interceptor wraps everything in { data: ... }
    // You can "unwrap" it here so your components just get the object
    return response;
  },
  (error) => {
    // Centralize error handling (e.g., alert the user)
    return Promise.reject(error);
  },
);

export default apiClient;
