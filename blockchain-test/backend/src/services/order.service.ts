import { Contract } from "ethers";
import { ContractUtils } from '../utils/contract.utils';
import { CustomerBc, Order, OrderBc } from "../model/order.model";
import { UserRoleBc } from "../model/user.register.contract.model";
import dotenv from "dotenv";

export class OrderService {
  static async emitBuyerInfo(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;
  
    const address = payload.address as string;
    const id =  payload.id as string;
    const name =  payload.name as string;
    const email =  payload.email as string;
    const company =  payload.company as string;
      
    const orderContract = await OrderService.getContractInstance(regOrderContract, address);
    
    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;
    
    try {
      transaction = await orderContract.informBuyerAboutCustomer(id, name, email, company);
      receipt = await transaction.wait();

      if (receipt.status !== 1) {
        return { transaction, receipt, error };
      }
      return { transaction, receipt, error };

    } catch (err: any) {
      console.log("\nOrderService.emitBuyerInfo - ERROR");
      return { transaction, receipt, error };
    }
  };

  static async emitResourceInfo(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;
  
    const address = payload.address as string;
    const company =  payload.company as string;
    const amount =  payload.amount as number;
      
    const orderContract = await OrderService.getContractInstance(regOrderContract, address);
    
    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;
    
    try {
      transaction = await orderContract.informBuyerAboutBindedResources(company, amount);
      receipt = await transaction.wait();

      if (receipt.status !== 1) {
        return { transaction, receipt, error };
      }
      return { transaction, receipt, error };

    } catch (err: any) {
      console.log("\nOrderService.emitBuyerInfo - ERROR");
      return { transaction, receipt, error };
    }
  };
  
  static async emitInformSeller(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;
  
    const address = payload.address as string;
    const seller = payload.seller as string;
    const sellerEmail = payload.sellerEmail as string;
    const buyer = payload.buyer as string;
    const buyerEmail = payload.buyerEmail as string;
    const amount =  payload.amount as number;
    const productBought =  payload.productBought as string;

      
    const orderContract = await OrderService.getContractInstance(regOrderContract, address);
    
    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;
        
    try {
      // transaction = await orderContract.informSeller(id, name, email, company, company, amount);
      transaction = await orderContract.informSeller(seller, sellerEmail, buyer, buyerEmail, address, amount, productBought);

      receipt = await transaction.wait();

      if (receipt.status !== 1) {
        return { transaction, receipt, error };
      }
      return { transaction, receipt, error };

    } catch (err: any) {
      console.log("\nOrderService.emitInformSeller - ERROR");
      return { transaction, receipt, error };
    }
  };

  static async fetchCustomerInfoByEmail(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;
  
    const address = payload.address as string;
    const email = payload.email as string;
      
    const orderContract = await OrderService.getContractInstance(regOrderContract, address);
  
    let customer: CustomerBc;
    let error: any = null;
    
    try {  
      customer = await orderContract.fetchCustomerInfoByEmail(email);
      console.log(customer);
      if (customer!.email !== "") {
        return customer;
      } else {
        return null;
      }

    } catch (err: any) {
      console.log("\nOrderService.fetchCustomerInfoByEmail - ERROR");
      error = err;
      return { error };
    }
  };

  static async fetchCustomerList(payload: any) {
    dotenv.config();
    const regUserContract = process.env.regUserSmartContract!;
    const regOrderContract = process.env.regOrderSmartContract!;
  
    const address = payload.address as string;
    const company = payload.company as string;
      
    const userContract = await OrderService.getContractInstance(regUserContract, address);
    const orderContract = await OrderService.getContractInstance(regOrderContract, address);
  
    let customerList: CustomerBc[] = [];
    let error: any = null;

    try {
  
      const user = await userContract.getUserDetailsByAddress(address);
      const role = UserRoleBc[user[4]];

      const customers = await orderContract.retrieveCustomerList(role, company);

      for (const index in customers) {
        const customer = customers[index];
        if (customer[0] !== "") {
          const temp = {
            id: Number(String(customer[0]).split("_")[3]),
            name: customer[1] as string,
            email: customer[2] as string,
            company: customer[3] as string,
          } as CustomerBc;
            customerList.push(temp);
        }
      }

      return customerList;
    } catch (err: any) {
      console.log("\nOrderService.fetchCustomerList - ERROR");
      error = err;
      return { error };
    }
  };

  static async fetchOrderById(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const  address = payload.address as string;
    const  orderId = payload.orderId as string;
    
    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let result: any = null;
    let error: any = null;

    try {
      const isOrderRegistered = await contract.isOrderRegisteredByOrderId(orderId);
      
      if (isOrderRegistered) {
        const order = await contract.orderByOrderId(orderId);

        const createdAt = Number(order[3]) !== 0 ? new Date(Number(order[3])) : null;
        const deliveredAt = Number(order[4]) !== 0 ? new Date(Number(order[4])) : null;
        result = {
          id: Number(String(order[0]).split("_")[3]),
          customerId: Number(String(order[1]).split("_")[3]),
          title: order[2][1] as string,
          amount: Number(order[2][2]),
          createdAt,
          deliveredAt,
          type: order[5] as string,
          status: order[6] as string,
        };
      }

      return result;
    } catch (err: any) {
      console.log("\nOrderService.fetchOrderById - ERROR");
      error = err;
      return { error };
    }
  };

  static async fetchOrdersByCustomerEmail(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const  address = payload.address as string;
    const  email = payload.email as string;
    
    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let result: any = [];
    let error: any = null;

    try {
      const isCustomerRegistered = await contract.isCustomerRegisteredByEmail(email);
      
      if (isCustomerRegistered) {
        const customer = await contract.customerByCustomerEmail(email);
        const customerId = customer[0];
        const orders = await contract.retrieveOrders(customerId);

        for (const order of orders) {
          if (order[1] === customerId) {
            const createdAt = Number(order[3]) !== 0 ? new Date(Number(order[3])) : null;
            const deliveredAt = Number(order[4]) !== 0 ? new Date(Number(order[4])) : null;
            const temp = {
              id: Number(String(order[0]).split("_")[3]),
              customerId: Number(String(order[1]).split("_")[3]),
              title: order[2][1] as string,
              amount: Number(order[2][2]),
              createdAt,
              deliveredAt,
              type: order[5] as string,
              status: order[6] as string,
            };
            result.push(temp);
          }
        }
      }

      return result;
    } catch (err: any) {
      console.log("\nOrderService.fetchOrdersByCustomerEmail - ERROR");
      error = err;
      return { error };
    }
  };

  static async fetchOrdersByCustomerId(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const  address = payload.address as string;
    const  customerId = payload.customerId as string;
    
    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let result: any = [];
    let error: any = null;

    try {
      const isCustomerRegistered = await contract.isCustomerRegisteredById(customerId);

      if (isCustomerRegistered) {
        const orders = await contract.retrieveOrdersForCustomer(customerId);
        if (orders[0][0].length > 0){
          for (const order of orders) {
            if (order[1] === customerId) {
              const createdAt = Number(order[3]) !== 0 ? new Date(Number(order[3])) : null;
              const deliveredAt = Number(order[4]) !== 0 ? new Date(Number(order[4])) : null;
              const temp = {
                id: Number(String(order[0]).split("_")[3]),
                customerId: Number(String(order[1]).split("_")[3]),
                title: order[2][1] as string,
                amount: Number(order[2][2]),
                createdAt,
                deliveredAt,
                type: order[5] as string,
                status: order[6] as string,
              };
              result.push(temp);
            }
          }          
        }
      }
      return result;
    } catch (err: any) {
      console.log("\nOrderService.fetchOrdersByCustomerId - ERROR");
      console.log("Are the orders registered on Blockchain?");
      error = err;
      // console.log(error);
      return { error };
    }
  };

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

  static async registerCustomer(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const address = payload.address as string;
    const id =  payload.id as string;
    const name =  payload.name as string;
    const email =  payload.email as string;
    const company =  payload.company as string;
    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    try {
      const isRegistered = await contract.isCustomerRegisteredById(id) as boolean;
      
      if (!isRegistered) {
        transaction = await contract.enrollCustomer(id, name, email, company);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`\nregisterCustomer: Transaction was successfull with hash: ${receipt.hash}\n`);
        return { transaction, receipt, error };
      } else {
        console.log("\nregisterCustomer: Transaction was not successfull: Customer already exists on blockchain\n");
        return { transaction, receipt, error };
      } 
    } catch (err: any) {
      console.log("\nOrderService.registerCustomer - ERROR");
      error = err;
      return { transaction, receipt, error };
    }
  };

  static async receiveIncomingOrder(companyName: string) {
    dotenv.config();
    const updatedResourcesFile = companyName + "_" + process.env.placedOrderFile!;

    const utils = new ContractUtils();
    let context = null;
    try {
      context = utils.readFromFile(updatedResourcesFile);
      utils.removeFile(updatedResourcesFile);
    } catch (err: any) {
      console.log("\nOrderService.receiveIncomingOrder - ERROR: File not found");
    }
    return context;
  }

  static async registerResource(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const address = payload.address as string;
    const resourceId = payload.resourceId as string;
    const product =  payload.product as string;
    const amount =  payload.amount as number;

    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    try {
      const resourceRegistered = await contract.resourceByResourceId(resourceId);
      const resourceRegisteredId = Number(resourceRegistered[0]);

      if (resourceRegisteredId !== 0) {
        console.log("\nregisterResource: Transaction was not successfull: Resource already exists on blockchain\n");
        return { transaction, receipt, error };
      } else {
        transaction = await contract.createResource(resourceId, product, amount);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`\nregisterResource: Transaction was successfull with hash: ${receipt.hash}\n`);
        return { transaction, receipt, error };
      }      
    } catch (err: any) {
      console.log("\nOrderService.registerResource - ERROR");
      error = err;
      return { transaction, receipt, error };
    }
  };
  
  static async registerOrder(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const  address = payload.address as string;
    const  orderId = payload.orderId as string;
    const  customerId = payload.customerId as string;
    const  resourceId = payload.resourceId as string;
    const  createdAt = payload.createdAt as number;
    const  deliveredAt = payload.deliveredAt as number;
    const  orderType = payload.orderType as string;
    const  orderStatus = payload.orderStatus as string;
    
    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    try {
      const resourceRegistered = await contract.resourceByResourceId(resourceId);
      const resourceRegisteredId = Number(resourceRegistered[0]);      

      if (resourceRegisteredId !== 0) {
        transaction = await contract.createOrder(orderId, customerId, resourceId, createdAt, deliveredAt, orderType, orderStatus);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`\nregisterOrder: Transaction was successfull with hash: ${receipt.hash}\n`);
        return { transaction, receipt, error };
      } else {
        console.log("\nregisterOrder: Transaction was not successfull: Missing Resource on Blockchain\n");
        return { transaction, receipt, error };
      } 
    } catch (err: any) {
      console.log("\nOrderService.registerOrder - ERROR");
      error = err;
      return { transaction, receipt, error };
    }
  };

  static async retrieveEverything(payload: any) {
  
    const address = payload.address as string;
    const company = payload.company as string;
        
    let customers: CustomerBc[] = [];
    let result: any[] = []
    let error: any = null; 

    try {  
      const customerPayload = {
        address,
        company,
      };
      customers = await this.fetchCustomerList(customerPayload) as CustomerBc[];

      if (customers.length > 0) {
        for (const customer of customers) {
          const orderPayload = {
            address,
            customerId: customer.company + "_CustomerId_" + customer.id as string,
          };
          const temp = customer as any;
          temp.orders = await this.fetchOrdersByCustomerId(orderPayload);
          result.push(temp)
        }
      }
      return result;
    } catch (err: any) {
      console.log("\nOrderService.retrieveEverything - ERROR");
      error = err;
      return { error };
    }
  };
  
  static async updateDeliveryDate(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const address = payload.address as string;
    const orderId = payload.orderId as string;
    const deliveredAt = payload.deliveredAt as number;

    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    try {
      const isOrderRegistered = await contract.isOrderRegisteredByOrderId(orderId);

      if (isOrderRegistered) {
        transaction = await contract.updateOrderDeliveryDate(orderId, deliveredAt);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`\nupdateDeliveryDate: Transaction was successfull with hash: ${receipt.hash}\n`);
        return { transaction, receipt, error };
      } else {
        console.log("\nupdateDeliveryDate: Transaction was not successfull: Missing Resource on Blockchain\n");
        return { transaction, receipt, error };
      } 
    } catch (err: any) {
      console.log("\nOrderService.updateDeliveryDate - ERROR");
      return { transaction, receipt, error };
    }
  };
  
  static async updateOrderStatus(payload: any) {
    dotenv.config();
    const regOrderContract = process.env.regOrderSmartContract!;

    const address = payload.address as string;
    const orderId = payload.orderId as string;
    const status = payload.status as string;

    const contract = await OrderService.getContractInstance(regOrderContract, address);

    let transaction: any = null;
    let receipt: any = null;
    let error: any = null;

    try {
      const isOrderRegistered = await contract.isOrderRegisteredByOrderId(orderId);

      if (isOrderRegistered) {
        transaction = await contract.updateOrderStatus(orderId, status);
        receipt = await transaction.wait();

        if (receipt.status !== 1) {
          return { transaction, receipt, error };
        }

        console.log(`\nupdateOrderStatus: Transaction was successfull with hash: ${receipt.hash}\n`);
        return { transaction, receipt, error };
      } else {
        console.log("\nupdateOrderStatus: Transaction was not successfull: Missing Resource on Blockchain\n");
        return { transaction, receipt, error };
      } 
    } catch (err: any) {
      console.log("\nOrderService.updateOrderStatus - ERROR");
      error = err;
      return { transaction, receipt, error };
    }
  };

};