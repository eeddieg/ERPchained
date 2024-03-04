import { Contract } from "ethers";
import { ContractUtils } from "../utils/contract.utils";
import dotenv from "dotenv";

export class ServerService {
   
  static async getAccountsList() {
    const utils = new ContractUtils();
    return utils.getAccounts();
  }

  static async getContractInstance(contractName: string, address: string) {
    const utils = new ContractUtils();
    const provider = await utils.getProvider();

    const privateKey = utils.getOwnerPrivateKey(address);
    const wallet = await utils.createWalletFromSecretKey(privateKey, provider);
    // const contract = await utils.getContractInstance(contractName, wallet);
    // const contrAddr = (contract.target as string).toLowerCase();

    // console.log(`New instance of ${contractName} at address ${contrAddr}`);
    // return contract as Contract;
    let contract = null;
    if (wallet !== null) {
      contract = await utils.getContractInstance(contractName, wallet);
      const contrAddr = (contract.target as string).toLowerCase();
  
      console.log(`New instance of ${contractName} at address ${contrAddr}`);
    }
    
    return contract as Contract;
  };

  static async getMaxBlockNumber() {
    const utils = await this.getUtils();
    const provider = await utils.getProvider();
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
  }

  static async fetchBlockByNumber(payload: any) {
    dotenv.config();
    const utils = new ContractUtils();
    const provider = utils.getProvider();

    const blockNumber = payload.blockNumber as number;
    return provider.getBlock(blockNumber);
  };

  static async fetchBlockInfoByTransactionHash(payload: any) {
    dotenv.config();
    const utils = new ContractUtils();
    const provider = utils.getProvider();

    const hash = payload.hash as string;
    return provider.getTransaction(hash);
  };

  static async fetchTransactionCountByAddress(payload: any) {
    dotenv.config();

    const  address = payload.address as string;

    const utils = new ContractUtils();
    const provider = utils.getProvider();

    return provider.getTransactionCount(address);
  }

  static async fetchTransactionReceipt(payload: any) {
    dotenv.config();
    const utils = new ContractUtils();
    const provider = utils.getProvider();

    const hash = payload.hash as string;
    return provider.getTransactionReceipt(hash);
  };

  static async getUtils() {
    const utils = new ContractUtils();
    return utils;
  }
  static async parseTransaction(payload: any) {
    const txBytes = payload.txBytes as string;
    const signature = payload.signature as any;
    let deserialTx = null;

    const utils = new ContractUtils();
    deserialTx = utils.parseTransaction(txBytes, signature);
    return deserialTx;
  }

};
