import { authService } from "@/services/authService";
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
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  verifyResetPasswordCode: (payload: {
    email: string;
    code: string;
  }) => Promise<boolean>;
  resetPasswordWithCode: (payload: {
    email: string;
    code: string;
    newPassword: string;
  }) => Promise<boolean>;
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
            const response = await authService.getMe();
            if (!mounted) return;
            setUser(response.data as User);
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
  }, []);

  /**
   * Helper to sync auth related state and storage
   * @param args
   */
  const setAuthData = async (args: {
    user: any;
    accessToken: string;
    refreshToken: string;
  }) => {
    // Setting tokens on store
    setAccessToken(args.accessToken);
    setRefreshToken(args.refreshToken);

    // Setting tokens on local storage
    await Promise.all([
      StorageHelper.save(StorageKeys.ACCESS_TOKEN, args.accessToken),
      StorageHelper.save(StorageKeys.REFRESH_TOKEN, args.refreshToken),
    ]);

    // Setting authenticated user
    setUser(args.user);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login({
        email,
        password,
      });

      // Session data
      const accessToken = response.data?.accessToken;
      const refreshToken = response.data?.refreshToken;
      const userData = response.data?.user as User;

      if (accessToken && refreshToken) {
        await setAuthData({
          user: userData,
          accessToken,
          refreshToken,
        });
        return true;
      }
      return false;
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
      await authService.register(userCreatePayload);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      await StorageHelper.removeItem(StorageKeys.ACCESS_TOKEN);
      await StorageHelper.removeItem(StorageKeys.REFRESH_TOKEN);
      setUser(null);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      setLoading(true);
      const response = await authService.verifyEmail(email, code);
      if (
        response?.data?.accessToken &&
        response?.data?.refreshToken &&
        response?.data?.user
      ) {
        await setAuthData({
          user: response?.data?.user,
          accessToken: response?.data?.accessToken,
          refreshToken: response?.data?.refreshToken,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      await authService.requestResetPassword(email);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyResetPasswordCode = async (payload: {
    email: string;
    code: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await authService.verifyResetPasswordCode(payload);
      if (data?.accessToken && data?.refreshToken && data?.user) {
        await setAuthData({
          user: data?.user,
          accessToken: data?.accessToken,
          refreshToken: data?.refreshToken,
        });
      }
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordWithCode = async (payload: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      await authService.resetPasswordWithCode(payload);
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
        verifyEmail,
        requestPasswordReset,
        verifyResetPasswordCode,
        resetPasswordWithCode,
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
