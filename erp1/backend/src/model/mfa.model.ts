import { User } from "./user.model"

export type MFA = {
  id?:        number,
  userId:     User["id"],
  status:     boolean,
  verified:   boolean,
  ascii:      string,
  hex:        string,
  base32:     string,
  otpAuthUrl: string,
  qr:         string,
}
