import apiClient from "@/api/client";
import { useAuthStore } from "@/store/auth-store";
import type { User, UserCreatePayload } from "@/types/user";
import React, { createContext, useContext, useEffect } from "react";
import { StorageHelper, StorageKeys } from "../helpers/storage.helper";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userCreatePayload: UserCreatePayload) => Promise<boolean>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Using a selector to pull only what we need from Zustand
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      setLoading(true);
      try {
        const token = await StorageHelper.get<string>(StorageKeys.ACCESS_TOKEN);
        if (token) {
          try {
            const { data } = await apiClient.get("/auth/me");
            if (!mounted) return;
            setUser(data);
          } catch {
            if (!mounted) return;
            await StorageHelper.removeItem(StorageKeys.ACCESS_TOKEN);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void bootstrapAuth();
    return () => {
      mounted = false;
    };
  }, [setUser, setLoading]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/auth/login", {
        email,
        password,
      });

      // Session data
      const accessToken = data?.accessToken;
      const refreshToken = data?.refreshToken;
      const user = data?.user;

      if (accessToken && refreshToken) {
        // Setting tokens on store
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        // Setting tokens on local storage
        await StorageHelper.save(StorageKeys.ACCESS_TOKEN, accessToken);
        await StorageHelper.save(StorageKeys.REFRESH_TOKEN, refreshToken);
      }
      setUser(user);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    userCreatePayload: UserCreatePayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/auth/register", {
        emai: userCreatePayload.email,
        password: userCreatePayload.password,
        firstName: userCreatePayload.firstName,
        lastName: userCreatePayload.lastName,
      });
      const token = data.token || data.accessToken;
      const user = data.user || data;
      if (token) {
        await StorageHelper.save(StorageKeys.ACCESS_TOKEN, token);
      }
      setUser(user);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      await StorageHelper.removeItem(StorageKeys.ACCESS_TOKEN);
      setUser(null);
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      await apiClient.post("/auth/request-password-reset", { email });
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
