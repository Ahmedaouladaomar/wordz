import apiClient from "@/api/client";
import { ApiResponse } from "@/types/api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordWithCodePayload,
  VerifyResetCodePayload,
} from "@/types/auth";
import { User } from "@/types/user";
import { AxiosInstance } from "axios";

class AuthService {
  private http: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.http = instance;
  }

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    const { data } = await this.http.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return data;
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    const { data } = await this.http.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload,
    );
    return data;
  }

  async getMe(): Promise<ApiResponse<User>> {
    const { data } = await this.http.get<ApiResponse<User>>("/auth/me");
    return data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const { data } = await this.http.post<ApiResponse<void>>("/auth/logout");
    return data;
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    const { data } = await this.http.post<ApiResponse<void>>(
      "/auth/request-password-reset",
      { email },
    );
    return data;
  }

  async verifyResetCode(
    payload: VerifyResetCodePayload,
  ): Promise<ApiResponse<void>> {
    const { data } = await this.http.post<ApiResponse<void>>(
      "/auth/verify-reset-code",
      payload,
    );
    return data;
  }

  async resetPasswordWithCode(
    payload: ResetPasswordWithCodePayload,
  ): Promise<ApiResponse<void>> {
    const { data } = await this.http.post<ApiResponse<void>>(
      "/auth/reset-password",
      payload,
    );
    return data;
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> {
    const { data } = await this.http.post<ApiResponse<void>>(
      "/auth/reset-password",
      { token, newPassword },
    );
    return data;
  }
}

// Export a single instance (Singleton)
export const authService = new AuthService(apiClient);
