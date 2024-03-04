import * as sp from "speakeasy";
import * as qrcode from "qrcode";

export class MFAuthenticationClass {

  static enableTwoFactor() {

    const secret = sp.generateSecret();
    qrcode.toDataURL(secret.otpauth_url!, (err: any, qrImage: any) => {
      if (err) return err;
      return {
        qrImage,
        secret,
      }
    });
  }
  
  static verifyTwoFactor(data: any) {
    const verified = sp.totp.verify({
      secret: data.base32Secret,
      encoding: "base32",
      token: data.token,
    });
    
    if (verified) {
      return true;
    } else {
      return false;
    }
  }

}
