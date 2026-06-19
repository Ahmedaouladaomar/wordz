import { ApiResponse } from "@/types/api";
import { User, UserUpdatePayload } from "@/types/user";
import { BaseApiService } from "./baseApiService";

// Query keys stay the same
export const userQueryKeys = {
  all: ["users"] as const,
  profile: (userId: string) =>
    [...userQueryKeys.all, "profile", userId] as const,
};

class UserService extends BaseApiService {
  protected readonly prefix = "/users";

  /**
   * Get user profile by ID
   */
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.handleRequest<User>(`/${userId}`, "get");
  }

  /**
   * Update user profile data
   */
  async updateUser(
    userId: string,
    payload: UserUpdatePayload,
  ): Promise<ApiResponse<User>> {
    return this.handleRequest<User>(`/${userId}`, "patch", payload);
  }

  /**
   * Permanently delete user account
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(`/${userId}`, "delete");
  }
}

// Export the singleton instance
export const userService = new UserService();
