export interface MFA {
  id: number;
  userId: number;
  status: boolean;
  verified: boolean;
  ascii: string;
  hex: string;
  base32: string;
  otpAuthUrl: string;
  qr: string;
}
