export enum AuthStatus { NO, YES }
export enum Register { NO, YES }

export interface RegUserContract {
  address: string;
  id: number;
  email: string;
  company: string;
  role: string;
  regStatus: Register;
  authStatus: AuthStatus;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export enum UserRoleBc {
  ADMIN,
  MODERATOR,
  USER,
}