import { StorageHelper, StorageKeys } from "@/helpers/storage.helper";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

let isRefreshing = false;
let promisesQueue: any[] = [];

// Pauses execution for a specified number of milliseconds. Basically for animation purposes.
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// This function clears the waiting room once the new token arrives
const processQueue = (error: any, token: string | null = null) => {
  promisesQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  promisesQueue = [];
};

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  // Store first (fast)
  let token = useAuthStore.getState().accessToken;

  // Fallback to disk if store is still rehydrating (slower but reliable)
  if (!token) {
    token = await StorageHelper.get<string>(StorageKeys.ACCESS_TOKEN);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  // Handle positive response
  (response) => response,
  // Handling negative response
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already happening, wait in the queue
      if (isRefreshing) {
        return (
          new Promise((resolve, reject) => {
            // Stacking promise
            promisesQueue.push({ resolve, reject });
          })
            // When executing the promise, we hand it the token we received from the first request
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err))
        );
      }

      // If this is the first request to hit 401, start the refresh
      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // We use a fresh axios call here to avoid interceptor interference
        StorageHelper.get<string>(StorageKeys.REFRESH_TOKEN)
          .then((refreshToken) => {
            return axios.post(
              `${baseURL}/auth/refresh`,
              {},
              {
                headers: { Authorization: `Bearer ${refreshToken}` },
              },
            );
          })
          .then((res) => {
            const { accessToken, refreshToken } = res.data.data;

            // Update Memory
            useAuthStore.getState().setAccessToken(accessToken);
            useAuthStore.getState().setRefreshToken(refreshToken);

            // Update Disk
            StorageHelper.save(StorageKeys.ACCESS_TOKEN, accessToken);
            StorageHelper.save(StorageKeys.REFRESH_TOKEN, refreshToken);

            // Release the "waiting" requests
            processQueue(null, accessToken);

            // Finally, retry Request A
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // If refresh fails, log out
            useAuthStore.getState().logout();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
