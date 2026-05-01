import apiClient from "../api/client";

// Query keys for user-related queries
export const userQueryKeys = {
  all: ["users"] as const,
  profile: (userId: string) =>
    [...userQueryKeys.all, "profile", userId] as const,
};

// Service class for user-related API operations
export class UserService {
  // Read: Get user profile
  static async getUser(userId: string) {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  // Update: Update user profile
  static async updateUser(userId: string, data: any) {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  }

  // Delete: Delete user
  static async deleteUser(userId: string) {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  }

  // Password reset: Request password reset
  static async requestPasswordReset(email: string) {
    const response = await apiClient.post("/auth/request-password-reset", {
      email,
    });
    return response.data;
  }

  // Password reset: Reset password with token
  static async resetPassword(token: string, newPassword: string) {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  }
}
