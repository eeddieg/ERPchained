import { MFA } from '@/model/mfa.model';
import db from "../utils/db.utils";
import { User } from "../model/user.model";

class UserService {
  // Find a single user by email
  static findUserByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: {
        email
      }
    });
  };
  
  // Find a single user by ID
  static findUserById(id: number): Promise<User | null> {
    return db.user.findUnique({
      where: {
        id
      }
    });
  };
  
  // Find a single user by email
  static async getAllUsers(): Promise<object> {
    return await db.user.findMany();
  };

  // Count existing users
  static async countAllUsers(): Promise<number> {
    return await db.user.count();
  };
  // Find MFA status of a single user by userID
  static findUserMFAStatus(userId: number): Promise<MFA | null> {
    return db.mFA.findUnique({
      where: {
        userId: userId
      }
    });
  };
  
  // Create new user
  static createUser(data: User): Promise<User> {    
    return db.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        refreshToken: data.refreshToken as string | "",
        mfaId: data.mfaId,
        address: data.address as string,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
        refreshToken: true,
        mfaId: true,
        address: true,
      },
    });
  };

  static async updateUser(id: number, data: any): Promise<User> {
    const updatedUser = await db.user.update({
      where: {
        id
      },
      data
    });
    return updatedUser;
  };

}

export default UserService;
