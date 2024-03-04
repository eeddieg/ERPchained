import db from "../utils/db.utils";
import { MFA } from '../model/mfa.model';
import UserService from "./user.service";
import { User } from "../model/user.model";

class MfaService {  
  // Find a single user by email
  static findMFAById(id: number): Promise<MFA | null> {
    return db.mFA.findUnique({
      where: {
        id
      }
    });
  };
 
  static async storeMFA(mfaData: MFA): Promise<MFA> {
    return db.mFA.create({
      data: {
        userId: mfaData.userId as number,
        status: mfaData.status,
        verified: mfaData.verified,
        ascii: mfaData.ascii,
        hex: mfaData.hex,
        base32: mfaData.base32,
        otpAuthUrl: mfaData.otpAuthUrl,
        qr: mfaData.qr,
      },
    });      
  };

  static async updateMfaTable(data: any): Promise<MFA> {
    const updatedMfa = await db.mFA.update({
      where: {
        id: data.id,
      },
      data
    });

    return updatedMfa;
  };
  
  static async reset(id: number): Promise<MFA | null> {
    const resetMfa = await db.mFA.delete({
      where: {
        id,
      }
    });
    return resetMfa;
  };

}

export default MfaService;
