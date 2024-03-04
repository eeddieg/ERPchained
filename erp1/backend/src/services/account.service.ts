import { AvailableBlockchainAddress } from "../model/availableBlockchainAddress.model";
import { AssignedBlockchainAddress } from "../model/assignedBlockchainAddress.model";
import db from "../utils/db.utils";
import dotenv from "dotenv";

export default class AccountService {
  // Find a assigned account bu accounts id
  static findAccountById (id: number): Promise<AssignedBlockchainAddress | null> {
    return db.assignedBlockchainAddress.findUnique({
      where: {
        id
      }
    });
  };
  
  // Find a assigned account bu accounts id
  static findAssignedAddressByEmail (email: string): Promise<AssignedBlockchainAddress | null> {
    return db.assignedBlockchainAddress.findUnique({
      where: {
        email
      }
    });
  };
  
  // Find a single user by ID
  static countAccounts(): Promise<number> {
    return db.assignedBlockchainAddress.count();
  };
  
  // Find a next unassigned address on Blockchain
  static async findNextUnassignedAccount(): Promise<AvailableBlockchainAddress | undefined | null> {
    dotenv.config();
    const accLimit = parseInt(process.env.GANACHE_ACCOUNT_LIMIT!);
    
    const assignedAcc = await db.assignedBlockchainAddress.findFirst({
      orderBy: {
        id: "desc"
      },
    });

    if (assignedAcc != null) {
      if (assignedAcc?.id >= accLimit) return null;
      
      const availableAcc = await db.availableBlockchainAddress.findUnique({
        where: {
          address: assignedAcc?.address
        },
      });
      
      const unassAcc = await db.availableBlockchainAddress.findUnique({
        where: {
          id: (availableAcc!.id + 1),
        },
      });

      return unassAcc!;
    }

  };

  static async storeAssignedBlockchainAddress(data: AssignedBlockchainAddress): Promise<AssignedBlockchainAddress> {
    const acc = await db.assignedBlockchainAddress.create({
      data: {
        address: data.address as string,
        email: data.email as string,
      },
      select: {
        address: true,
        email: true,
      }
    });
    return acc;
  };
  
  // static async updateAssignedBlockchainAddress(id: number, data: any): Promise<AssignedBlockchainAddress> {
  //   const updatedUser = await db.users.update({
  //     where: {
  //       id
  //     },
  //     data
  //   });
  //   return updatedUser;
  // };
  
};
