export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
  streak?: number;
  dailyTarget: number;
  level?: number;
  totalWords?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCreatePayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type UserUpdatePayload = Partial<UserCreatePayload>;

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}
