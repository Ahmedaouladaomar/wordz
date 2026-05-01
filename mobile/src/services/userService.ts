import { ApiResponse } from "@/types/api";
import { PasswordResetPayload, User, UserUpdatePayload } from "@/types/user";
import { AxiosInstance } from "axios";
import apiClient from "../api/client";

// Query keys for React Query / TanStack Query
export const userQueryKeys = {
  all: ["users"] as const,
  profile: (userId: string) =>
    [...userQueryKeys.all, "profile", userId] as const,
};

class UserService {
  private http: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.http = instance;
  }

  /**
   * Get user profile by ID
   */
  async getUser(userId: string): Promise<ApiResponse<User>> {
    const { data } = await this.http.get<ApiResponse<User>>(`/users/${userId}`);
    return data;
  }

  /**
   * Update user profile data
   */
  async updateUser(
    userId: string,
    payload: UserUpdatePayload,
  ): Promise<ApiResponse<User>> {
    const { data } = await this.http.put<ApiResponse<User>>(
      `/users/${userId}`,
      payload,
    );
    return data;
  }

  /**
   * Permanently delete user account
   */
  async deleteUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    const { data } = await this.http.delete<ApiResponse<{ success: boolean }>>(
      `/users/${userId}`,
    );
    return data;
  }

  /**
   * Request a password reset email
   */
  async requestPasswordReset(
    email: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const { data } = await this.http.post<ApiResponse<{ message: string }>>(
      "/auth/request-password-reset",
      {
        email,
      },
    );
    return data;
  }

  /**
   * Submit new password using the token received via email
   */
  async resetPassword(
    payload: PasswordResetPayload,
  ): Promise<ApiResponse<{ success: boolean }>> {
    const { data } = await this.http.post<ApiResponse<{ success: boolean }>>(
      "/auth/reset-password",
      payload,
    );
    return data;
  }
}

// Export a single instance to be used throughout the app
export const userService = new UserService(apiClient);
