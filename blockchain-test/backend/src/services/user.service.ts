import { Contract, ethers } from "ethers";
import { ContractUtils } from '../utils/contract.utils';
import dotenv from "dotenv";
import { AuthStatus } from "../model/user.register.contract.model";

export class UserService {

  static async enrollUser(payload: any) {
    dotenv.config();
    const regUserContract = process.env.regUserSmartContract!;

    const utils = new ContractUtils();
    const provider = await utils.getProvider();
    const signer = await provider.getSigner();
    
    // const wallet = utils.getWallet(payload.address, provider);
    // const contract = await utils.getContractInstance(regUserContract, wallet);

    const contract = await utils.getContractInstance(regUserContract, signer);
    const contrAddr = (contract.target as string).toLowerCase();

    console.log(`New instance of ${regUserContract} at address ${contrAddr}`);
    console.log(`${regUserContract} called`);
    
    const address = (payload.address as string).replace(/\s/g, "");
    const id =  payload.id;
    const email =  payload.email;
    const company =  payload.company;
    const role =  payload.role;
    
    try {
      const transaction = await contract.register(address, id, email, company, role);
      const receipt = await transaction.wait();
  
      if (receipt.status !== 1) {
        return null;
      }
      console.log(`\nenrollUser: Transaction was successfull with hash: ${receipt.hash}\n`);
      return receipt;
      
    } catch (error: any) {
      console.log("\nUserService.enrollUser - ERROR");
      return error;
      // return { code, message };
    }
  };

  static async getAuthStatus(payload: any) {
    dotenv.config();
    const regUserContract = process.env.regUserSmartContract!;

    const utils = new ContractUtils();
    const provider = await utils.getProvider();
    const signer = await provider.getSigner();
    
    // const wallet = utils.getWallet(payload.address, provider);
    // const contract = await utils.getContractInstance(regUserContract, wallet);

    const contract = await utils.getContractInstance(regUserContract, signer);
    const contrAddr = (contract.target as string).toLowerCase();

    console.log(`New instance of ${regUserContract} at address ${contrAddr}`);
    console.log(`getAuthStatus function of ${regUserContract} called`);
    
    try {
      const address = (payload.address as string).toLowerCase();
      return Number(await contract.getAuthStatus(address));
    } catch (error: any) {
      console.log("\nUserService.getAuthStatus - ERROR");
      console.log(error.info.error.code);
      console.log(error.info.error.message);
      return error;
    }
  };
  
  static async setAuthStatus(payload: any) {
    dotenv.config();
    const regUserContract = process.env.regUserSmartContract!;

    const utils = new ContractUtils();
    const provider = await utils.getProvider();
    const signer = await provider.getSigner();
    
    // const wallet = utils.getWallet(payload.address, provider);
    // const contract = await utils.getContractInstance(regUserContract, wallet);

    const contract = await utils.getContractInstance(regUserContract, signer);
    const contrAddr = (contract.target as string).toLowerCase();

    console.log(`New instance of ${regUserContract} at address ${contrAddr}`);
    console.log(`${regUserContract} called`);
        
    try {
      const address = payload.address;
      const status = payload.status;
      const transaction = await contract.setAuthStatus(address, status);
      const receipt = await transaction.wait();
  
      if (receipt.status !== 1) {
        return null;
      }
      console.log(`\nsetAuthStatus: Transaction was successfull with hash: ${receipt.hash}\n`);
      return receipt;
      
    } catch (error: any) {
      console.log("\nUserService.setAuthStatus - ERROR");
      const code = error.info.error.code;
      const message = error.info.error.message;
      return { code, message };
    }
  };
  
  static async getUserDetails(payload: any) {
    dotenv.config();
    const regUserContract = process.env.regUserSmartContract!;

    const utils = new ContractUtils();
    const provider = await utils.getProvider();
    const signer = await provider.getSigner();

    const address = payload.address as string;
    const wallet = utils.getWallet(address, provider);
    const contract = await utils.getContractInstance(regUserContract, wallet);

    // const contract = await utils.getContractInstance(regUserContract, signer);
    const contrAddr = (contract.target as string).toLowerCase();

    console.log(`\nNew instance of ${regUserContract} at address ${contrAddr}`);
    console.log(`${regUserContract} called\n`);

    const email =  payload.email as string;

    let transaction = null; 
    try {
      transaction = await contract.getUserDetailsByEmail(email);
    } catch (error: any) {
      console.log("\nUserService.getUserDetails - ERROR");
      console.log(error.info.error.code);
      console.log(error.info.error.message);
      return transaction;
    }
    return transaction;
  };

};
