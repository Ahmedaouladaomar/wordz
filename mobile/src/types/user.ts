export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
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
