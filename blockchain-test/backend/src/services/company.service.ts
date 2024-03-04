import { Contract } from "ethers";
import { ContractUtils } from '../utils/contract.utils';
import dotenv from "dotenv";
import { Company } from "../model/company.model";

export class CompanyService {

  static async checkRegStatus(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const companyName = payload.companyName as string;

    const contract = await CompanyService.getContractInstance(regCompContract, address);
    
    let error: any = null;

    try {
      const isRegistered = await contract.companyRegistry(companyName) as boolean;

      if (isRegistered) {
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      console.log("\CompanyService.checkRegStatus - ERROR");
      error = err;
      return false;
    }
  };

  static async fetchBuyList(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const product = payload.product as string;

    const contract = await CompanyService.getContractInstance(regCompContract, address);

    try {
      const res = await contract.fetchBuyingList(product);

      if (res.length > 0) {
        let list: Company[] = [];
        for (const comp of res) {
          const company = {
            companyName: comp[0] as string,
            address: comp[1] as string,
            email: comp[2] as string,
            reservedResources: Number(comp[3]),
            availableResources: Number(comp[4]),
            productToBuy: comp[5] as string,
            productToSell: comp[6] as string,
          } as Company;
          if (company.companyName !== "") {
            list.push(company);
          }
        }
        return list;
      } else {
        return null;
      }
    } catch (err: any) {
      console.log("\CompanyService.fetchBuyList - ERROR\n");
      // console.log(err);
      return err.reason;
    }
  };

  static async fetchCompany(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const companyName = payload.companyName as string;

    const contract = await CompanyService.getContractInstance(regCompContract, address);

    let company: any = null;
    try {
      const res = await contract.getCompanyFromBc(companyName);
      // console.log("CompanyService.fetchCompany");
      // console.log(res);
      if (res.length > 0) {
        company = {
          companyName: companyName as string,
          address: res[1] as string,
          email: res[2] as string,
          reservedResources: Number(res[3]),
          availableResources: Number(res[4]),
          productToBuy: res[5] as string,
          productToSell: res[6] as string,
        } as Company;
      }
      return company;
    } catch (err: any) {
      console.log("\CompanyService.fetchCompany - ERROR\n");
      return null;
    }
  };

  static async fetchSellList(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const product = payload.product as string;

    const contract = await CompanyService.getContractInstance(regCompContract, address);

    try {
      const res = await contract.fetchSellingList(product);

      if (res.length > 0) {
        let list: Company[] = [];
        for (const comp of res) {
          const company = {
            companyName: comp[0] as string,
            address: comp[1] as string,
            email: comp[2] as string,
            reservedResources: Number(comp[3]),
            availableResources: Number(comp[4]),
            productToBuy: comp[5] as string,
            productToSell: comp[6] as string,
          } as Company;
          if (company.companyName !== "") {
            list.push(company);
          }
        }
        return list;
      } else {
        return null;
      }
    } catch (err: any) {
      console.log("\CompanyService.fetchSellList - ERROR\n");
      // console.log(err);
      return err.reason;
    }
  };

  static async getContractInstance(contractName: string, address: string) {
    const utils = new ContractUtils();
    const provider = await utils.getProvider();

    const privateKey = utils.getOwnerPrivateKey(address);
    const wallet = await utils.createWalletFromSecretKey(privateKey, provider);
    // const contract = await utils.getContractInstance(contractName, wallet);
    // const contrAddr = (contract.target as string).toLowerCase();

    // const nonce = await utils.getNonce(contrAddr);
    
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

  // static async receiveIncomingOrder(companyName: string) {
  //   dotenv.config();
  //   const updatedResourcesFile = companyName + "_" + process.env.placedOrderFile!;

  //   const utils = new ContractUtils();
  //   const context = utils.readFromFile(updatedResourcesFile);
  //   utils.removeFile(updatedResourcesFile);
  //   return context;
  // }

  static async registerCompany(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const availableResources = payload.availableResources as number;
    const companyName = payload.companyName as string;
    const email = payload.email as string;
    const productToBuy = payload.productToBuy as string;
    const productToSell = payload.productToSell as string;
    const reservedResources = payload.reservedResources as number;

    const contract = await CompanyService.getContractInstance(regCompContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    // console.log("\CompanyService.registerCompany");
    try {
      const isRegistered = await contract.companyRegistry(companyName) as boolean;

      if (!isRegistered) {
        transaction = await contract.enrollCompany(companyName, address, email, reservedResources, availableResources, productToBuy, productToSell);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`\nregisterCompany: Transaction was successfull with hash: ${receipt.hash}\n`);
        return { transaction, receipt, error };
      } else {
        console.log("\nregisterCompany: Transaction was not successfull: Company already exists on blockchain\n");
        return { transaction, receipt, error };
      }
    } catch (err: any) {
      console.log("\CompanyService.registerCompany - ERROR");
      error = err;
      return { transaction, receipt, error };
    }
  };

  static async setResources(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const companyName = payload.companyName as string;
    const reservedResources = payload.reservedResources as number;
    const availableResources = payload.availableResources as number;

    const contract = await CompanyService.getContractInstance(regCompContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;
    let setEvent: any = null;

    try {
      const isRegistered = await contract.companyRegistry(companyName) as boolean;

      if (isRegistered) {

        transaction = await contract.setTotalResources(companyName, reservedResources, availableResources);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, setEvent, error };
        }

        console.log(`\nsetResources: Transaction was successfull with hash: ${receipt.hash}\n`);

        return { transaction, receipt, setEvent, error };
      } else {
        console.log("\nsetResources: Transaction was not successfull: Company is not registered on blockchain\n");
        return { transaction, receipt, setEvent, error };
      }
    } catch (err: any) {
      console.log("\nCompanyService.setResources - ERROR");
      error = err;
      console.log(error);
      return { transaction, receipt, setEvent, error };
    }
  };

  static async streamedResources(companyName: string) {
    dotenv.config();
    const updatedResourcesFile = companyName + "_" + process.env.updatedResourcesFile!;

    const utils = new ContractUtils();
    let context: any = null;
    try {
      context = await utils.readFromFile(updatedResourcesFile);
    } catch (error: any) {
      console.log("CompanyService.streamedResources - ERROR");
      console.log("File could not be found.");
    }
    return context;
  }

  static async updateCompany(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const companyName = payload.companyName as string;
    const reservedResources = payload.reservedResources as number;
    const availableResources = payload.availableResources as number;
    const productToBuy = payload.productToBuy as string;
    const productToSell = payload.productToSell as string;

    const contract = await CompanyService.getContractInstance(regCompContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    try {
      const isRegistered = await contract.companyRegistry(companyName) as boolean;

      if (isRegistered) {
        transaction = await contract.updateCompanyInfo(companyName, reservedResources, availableResources, productToBuy, productToSell);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`\nupdateCompany: Transaction was successfull with hash: ${receipt.hash}\n`);

        // contract.on("UpdatedResources", (newResources) => {
        //   console.log(newResources);
        // });

        return { transaction, receipt, error };
      } else {
        console.log("\nupdateCompany: Transaction was not successfull: Company is not registered on blockchain\n");
        return { transaction, receipt, error };
      }
    } catch (err: any) {
      console.log("\CompanyService.updateCompany - ERROR");
      error = err;
      return { transaction, receipt, error };
    }
  };

  static async updateResources(payload: any) {
    dotenv.config();
    const regCompContract = process.env.regCompanySmartContract!;

    const address = payload.address as string;
    const companyName = payload.companyName as string;
    const reservedResources = payload.reservedResources as number;
    const availableResources = payload.availableResources as number;

    const contract = await CompanyService.getContractInstance(regCompContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    try {
      const isRegistered = await contract.companyRegistry(companyName) as boolean;

      if (isRegistered) {
        transaction = await contract.updateTotalResources(companyName, reservedResources, availableResources);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`updateResources: Transaction was successfull with hash: ${receipt.hash}\n`);

        // contract.on("UpdatedResources", (newResources) => {
        //   console.log(newResources);
        // });

        return { transaction, receipt, error };
      } else {
        console.log("\nupdateResources: Transaction was not successfull: Company is not registered on blockchain\n");
        return { transaction, receipt, error };
      }
    } catch (err: any) {
      console.log("\nCompanyService.updateResources - ERROR");
      error = err;
      console.log(error);
      return { transaction, receipt, error };
    }
  };

};
