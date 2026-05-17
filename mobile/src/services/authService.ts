import { ApiResponse } from "@/types/api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordWithCodePayload,
} from "@/types/auth";
import { User } from "@/types/user";
import { BaseApiService } from "./baseApiService";

class AuthService extends BaseApiService {
  protected readonly prefix: string = "/auth";

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest<AuthResponse>("/login", "post", payload);
  }

  async loginWithGoogle(tokenId: string): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest<AuthResponse>("/google", "post", {
      tokenId,
    });
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest<AuthResponse>("/register", "post", payload);
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.handleRequest<User>("/me", "get");
  }

  /**
   * Refresh the access token using a valid refresh token.
   */
  async refreshToken(token: string): Promise<ApiResponse<AuthResponse>> {
    // We send the token in the body as per industry standard for mobile
    return this.handleRequest<AuthResponse>("/refresh", "post", {
      refreshToken: token,
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.handleRequest<void>("/logout", "post");
  }

  async verifyEmail(
    email: string,
    code: string,
  ): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest<AuthResponse>("/verify-email", "post", {
      email,
      code,
    });
  }

  async requestResetPassword(email: string): Promise<ApiResponse<void>> {
    return this.handleRequest<void>("/request-reset-password", "post", {
      email,
    });
  }

  async verifyResetPasswordCode(payload: {
    email: string;
    code: string;
  }): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(
      "/verify-reset-password-code",
      "post",
      payload,
    );
  }

  async resetPasswordWithCode(
    payload: ResetPasswordWithCodePayload,
  ): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest<AuthResponse>("/reset-password", "post", payload);
  }
}

// Export a single instance (Singleton)
export const authService = new AuthService();
