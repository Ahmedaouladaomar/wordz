import { ScreenLoader } from "@/components/screen-loader";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/auth-store";
import type { User, UserCreatePayload } from "@/types/user";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { createContext, useContext, useEffect, useState } from "react";
import { StorageHelper, StorageKeys } from "../helpers/storage.helper";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (idToken: string) => Promise<boolean>;
  register: (userCreatePayload: UserCreatePayload) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  requestResetPassword: (email: string) => Promise<boolean>;
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
  // Setters
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setLoading = useAuthStore((state) => state.setLoading);
  // Initial auth loading
  const [isInitLoading, setIsInitLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeGoogleSignIn = async () => {
      try {
        const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
        const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

        if (!iosClientId || !webClientId) {
          console.warn(
            "Google Sign-In: Missing required environment variables. Please configure EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, and EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID",
          );
          return;
        }

        await GoogleSignin.configure({
          iosClientId,
          webClientId,
          offlineAccess: false,
          forceCodeForRefreshToken: false,
        });
      } catch (error) {
        console.warn("Google Sign-In initialization failed:", error);
      }
    };

    const checkAuth = async () => {
      try {
        const token = await StorageHelper.get<string>(StorageKeys.ACCESS_TOKEN);
        if (token) {
          try {
            // Retrieving authenticated user
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
          setIsInitLoading(false);
        }
      }
    };

    // Initialize Google Sign-In
    initializeGoogleSignIn();

    // Delay for animation purposes
    const timeout = setTimeout(checkAuth, 500);

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [setUser]);

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
    await StorageHelper.saveAuthItems({
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
    });

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

  const loginWithGoogle = async (tokenId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle(tokenId);

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
    setLoading(true);
    try {
      await authService.logout();
      await Promise.all(
        [StorageKeys.ACCESS_TOKEN, StorageKeys.REFRESH_TOKEN].map((key) =>
          StorageHelper.removeItem(key),
        ),
      );
      setUser(null);
    } finally {
      setLoading(false);
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

  const requestResetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await authService.requestResetPassword(email);
      return res.success;
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
      const { success } = await authService.verifyResetPasswordCode(payload);
      return success;
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
      const response = await authService.resetPasswordWithCode(payload);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        verifyEmail,
        requestResetPassword,
        verifyResetPasswordCode,
        resetPasswordWithCode,
      }}
    >
      {isInitLoading ? <ScreenLoader /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
