export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken: string;
  mfaId: number;
  address: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export enum AuthStatus {
  NO,
  YES,
}
export interface BcUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address: string;
}
