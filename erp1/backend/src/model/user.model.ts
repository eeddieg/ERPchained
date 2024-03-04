import type { UserRole } from "@prisma/client";

export type User = {
  id?:          number,
  firstName?:   string | null,
  lastName?:    string | null,
  email:        string,
  password:     string,
  role:         UserRole,
  refreshToken: string,
  mfaId?:       number | null,
  address?:     string | null,
}

export type BcUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address: string;
}