import { User } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  /** The user object returned from the database */
  user: User;

  /** Short-lived token used for authorized requests */
  accessToken: string;

  /** Long-lived token used to swap for a new accessToken when it expires */
  refreshToken: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface ResetPasswordWithCodePayload {
  email: string;
  code: string;
  newPassword: string;
}
