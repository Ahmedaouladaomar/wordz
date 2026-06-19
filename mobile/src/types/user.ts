export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
  streak?: number;
  dailyTarget: number;
  level?: UserLevel;
  totalWords?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLevel {
  rank: number;
  totalWords: number;
  title: string;
}

export interface UserCreatePayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dailyTarget?: number;
}

export type UserUpdatePayload = Partial<UserCreatePayload>;

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}
