import path from "path";
import fs from "fs";
import * as fsExtra from "fs-extra";
import { Contract, ContractFactory, ethers, Transaction, TransactionDescription, Wallet } from "ethers";
import * as accountsInfo from "../../keys.json";
import dotenv from "dotenv";
import commandExists from "command-exists";

export class ContractUtils {
  private compiledFolder: any;
  private compiledPath: any;
  private contractsFolder: any;
  private contractsFolderPath: any;
  private contractInfoFile: string;
  private ownerAddress: string;
  private ownerPrivateKey: string;
  private provider: any;
  private rootFolder: any;
  private wallet: Wallet | null;


  constructor() {
    dotenv.config();
    this.rootFolder = "";
    this.contractsFolder = "contracts";
    this.compiledFolder = "compiled";
    this.contractsFolderPath = path.resolve(this.contractsFolder);
    this.compiledPath = path.resolve(this.contractsFolder, this.compiledFolder);
    this.contractInfoFile = ".info";
    this.wallet = null;

    this.provider = new ethers.JsonRpcProvider(process.env.PROVIDER!);

    // From ganache and the word list we provide. see package.json -> ganache script
    const owner = this.getLocalOwnerInfo();
    this.ownerAddress = owner.ownerAccount;
    this.ownerPrivateKey = owner.ownerPrivateKey;
    // this.ownerPrivateKey = this.getOwnerPrivateKey(this.ownerAddress) as string;

    this.log()
  }

  public async compile(contractName: string) {
    this.createComplileFolder();
    const contract = path.resolve(this.contractsFolder, contractName);
    const abiScript = `solc --overwrite --abi ${contract} -o ${this.compiledPath}`;
    const binScript = `solc --overwrite --bin ${contract} -o ${this.compiledPath}`;

    const util = require("node:util");
    const exec = util.promisify(require("node:child_process").exec);
    return await exec(abiScript + " | " + binScript);
  }

  private createComplileFolder() {
    const buildPath = path.resolve(this.contractsFolder, this.compiledFolder);
    fsExtra.ensureDirSync(buildPath);
  }

  public async createWalletFromSecretKey(privateKey: string, provider: any) {
    // return new Wallet(privateKey, provider);
    let wallet: Wallet | null = null;
    try {
     wallet = new Wallet(privateKey, provider); 
    } catch (error: any) {
      console.log("\n\nContractUtils.createWalletFromSecretKey");
      console.log(error);
    }   
    return wallet;
  }

  public async deploy(contractName: string) {
    const provider: any = this.provider;
    const compliledContractName = this.getContractName(contractName);
    
    const abiPath = path.resolve(
      this.compiledPath,
      compliledContractName + ".abi"
    );

    const binPath = path.resolve(
      this.compiledPath,
      compliledContractName + ".bin"
    );
    
    const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
    const bytecode = fs.readFileSync(binPath, "utf-8");
    
    const wallet = new Wallet(this.ownerPrivateKey, provider);
    const factory = new ContractFactory(abi, bytecode, wallet);
    
    const contract = await factory.deploy();
    //store contract info as JSON
    const filename = compliledContractName + this.contractInfoFile;
    this.writeToFile(filename, contract.target);
    return contract;
  }

  public async enableContracts() {
    const env = await this.setSolidityEnv();
    const regUserContract = process.env.regUserSmartContract!;
    const regOrderContract = process.env.regOrderSmartContract!;
    const regCompanyContract = process.env.regCompanySmartContract!;

    // Compile and deploy first contract
    // WARNING: the deployment MUST be nested
    // otherwise there is problem with tx nonce
    await this.compile(regUserContract).then((resCompUser) => {
      if (resCompUser.stderr === "") {
        this.deploy(regUserContract).then((resDepUser) => {
          console.log(`${regUserContract} has been deployed successfully at ${resDepUser.target}\n`);
          
          // Compile and deploy second contract
          this.compile(regOrderContract).then((resCompOrder)=> {
            if (resCompOrder.stderr === "") {
              this.deploy(regOrderContract).then((resDepOrder) => {
                // Registering event from Order Smart Contract
                resDepOrder.on("emitCustomer", (id: number, name: string, email: string, company: string) => {
                  const setEvent = {
                    id: id,
                    name: name,
                    email: email,
                    company: company,
                  };
                  // send event to VUE form to refresh values
                  this.formatEmitCustomerEventData(setEvent).then((data) => {                          
                    const temp = JSON.parse(JSON.stringify(data));
                    const companyName = temp.name;

                    var buf = Buffer.from(JSON.stringify(data));
                    const buyerInfoFile = companyName + "_" + process.env.buyerInfoFile!;
                    this.writeToFile(buyerInfoFile, buf);
                  });
                });
                // Registering event from Order Smart Contract
                resDepOrder.on("emitBindedResources", (company: string, amount: number) => {
                  const setEvent = {
                    amount,
                    company,
                  };
                  // send event to VUE form to refresh values
                  this.formatEmitBindedResourcesEventData(setEvent).then((data) => {                          
                    const temp = JSON.parse(JSON.stringify(data));
                    const company = temp.company;

                    var buf = Buffer.from(JSON.stringify(data));
                    const bindedResourcesInfoFile = company + "_" + process.env.bindedResourcesInfoFile!;
                    this.writeToFile(bindedResourcesInfoFile, buf);
                  });
                });
                // Emit  event of Placed Order
                resDepOrder.on("emitPlacedOrderInfo", (seller: string, sellerEmail: string, buyer: string, buyerEmail: string, buyerAddress: string, amount: number, productBought: string) => {
                  // send event to VUE form to refresh values
                  const data = {
                    seller,
                    sellerEmail,
                    buyer,
                    buyerEmail,
                    buyerAddress,
                    amount: Number(amount),
                    productBought,
                  }
                  const temp = JSON.parse(JSON.stringify(data));

                  var buf = Buffer.from(JSON.stringify(data));
                  const orderPlacedInfoFile = temp.seller + "_" + process.env.placedOrderFile!;
                  this.writeToFile(orderPlacedInfoFile, buf);
                  // start actions to store customer + details
                  this.receiveOrder();
                });

                console.log("Listeners from order related smart contract");
                resDepOrder.listenerCount(["emitCustomer"]).then((res) => {
                  console.log("emitCustomer");
                  console.log("listenerCount: " + res);
                });
                resDepOrder.listenerCount(["emitBindedResources"]).then((res) => {
                  console.log("emitBindedResources");
                  console.log("listenerCount: " + res);
                });
                resDepOrder.listenerCount(["emitPlacedOrderInfo"]).then((res) => {
                  console.log("emitPlacedOrderInfo");
                  console.log("listenerCount: " + res + "\n\n");
                });


                console.log(`${regOrderContract} has been deployed successfully at ${resDepOrder.target}\n`);
                // Compile and deploy third contract
                this.compile(regCompanyContract).then((resCompCompany) => {
                  if (resCompCompany.stderr === "") {
                    this.deploy(regCompanyContract).then((resDepCompany) => {
                      console.log("Listeners from company related smart contract");
                      // Registering event from Company Smart Contract
                      resDepCompany.on("UpdatedResources", (name: string, resResources: number, avResources: number) => {
                        const setEvent = {
                          name: name,
                          reservedResources: resResources,
                          availableResources: avResources,
                        };
                        // write locally so VUE app gets updated values
                        this.formatUpdateEventData(setEvent).then((data) => {
                          
                          const temp = JSON.parse(JSON.stringify(data));
                          const companyName = temp.name;
  
                          var buf = Buffer.from(JSON.stringify(data));
                          const updatedResourcesFile = companyName + "_" + process.env.updatedResourcesFile!;
                          this.writeToFile(updatedResourcesFile, buf);
                        });
                      });
                      resDepCompany.listenerCount(["UpdatedResources"]).then((res) => {
                        console.log("UpdatedResources");
                        console.log("listenerCount: " + res + "\n\n");
                      });

                      console.log(`${regCompanyContract} has been deployed successfully at ${resDepCompany.target}\n`);                
                    });
                  }
                });
              });
            }
          });
        });
      }
    });   
  }

  public async formatEmitBindedResourcesEventData(event: any) {
    const eventData = {
      amount: Number(event.amount),
      company: event.company as string,
    }
    return eventData;
  }
  
  public async formatEmitCustomerEventData(event: any) {
    const eventData = {
      id: Number(event.id),
      name: event.name as string,
      email: event.email as string,
      company: event.company as string,
    }
    return eventData;
  }

  public async formatUpdateEventData(event: any) {
    const eventData = {
      name: event.name as string,
      reservedResources: Number(event.reservedResources),
      availableResources: Number(event.availableResources),
    }
    return eventData;
  }

  public async getAccounts() {
    const provider = this.provider;
    return await provider.listAccounts();
  }

  public async getBalance() {
    return await this.provider.getBalance(this.getOwner().address);
  }

  // https://ethereum.stackexchange.com/questions/120817/how-to-call-a-contract-function-method-using-ethersjs
  public async getContractInstance(smartContractFileName: string, wallet: Wallet) {
    const contractAddress = await this.getDeployedContractAddress(smartContractFileName);
    const compliledContractName = this.getContractName(smartContractFileName);  

    const abiPath = path.resolve(this.compiledPath, compliledContractName + ".abi");
    const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

    const contract = new Contract(contractAddress, abi , wallet);
    return contract;
    
  }

  // Returns capitalized contract name without the extension 
  private getContractName(filename: string) {
    const smartContract = path.parse(path.resolve(this.contractsFolder, filename));
    const name = ([...smartContract.name][0].toUpperCase() + smartContract.name.slice(1));
    return name;
  }

  public getContractsFolder() {
    return this.contractsFolder;
  }

  public getDeployedContractAddress(contractFileName: string) {
    let contractAddress = "";
    const contractName = this.getContractName(contractFileName);
    const filename = contractName + this.contractInfoFile;
    try {
      contractAddress = this.readFromFile(filename);
    } catch (error: any) {
      console.log(error);
    }
    return contractAddress;
  }

  private getLocalOwnerInfo() {
    const privateKeys = accountsInfo.private_keys;
    const ownerAccount = Object.keys(privateKeys)[0];
    const ownerPrivateKey = Object.values(privateKeys)[0];
    return { ownerAccount, ownerPrivateKey };
  }
  
  public async getNonce(address: string) {
    return this.provider.getTransactionCount(address);
  }

  public getOwner() {
    const provider = this.provider;
    return provider.getSigner(0);
  } 

  public getOwnerPrivateKey(address: string): string {
    let ownerPrivateKey = "";

    if(address !== undefined) {
      if(address.length > 0) {
      // if(address != "") {
        const privateKeys = accountsInfo.private_keys as any;
        Object.keys(privateKeys).find((key) => {
          if (key === address.toLowerCase()) {
            ownerPrivateKey = privateKeys[key];
          }
        });    
      }
    }

    return ownerPrivateKey as string;
  }

  public getProvider() {
    return this.provider;
  }

  public getWallet(address: string, provider?: any) {
    const key = this.getOwnerPrivateKey(address);
    this.wallet = this.initWallet(key, provider);
    return this.wallet;
  }

  private initWallet(key: string, provider?: any): Wallet {
    const wallet = new Wallet(key, provider);
    return wallet;
  }

  //Log to console
  private log() {
    this.provider.getNetwork().then((network: any) => {
      console.log(
        `\n[${new Date().toLocaleTimeString()}] Connected to chain ID ${network.chainId
        }\n`
      );
    });
  }

  public parseTransaction(txBytes: any, signature: any) {
    const regOrderContract = process.env.regOrderSmartContract!;
    const compliledContractName = this.getContractName(regOrderContract);
    
    const abiPath = path.resolve(
      this.compiledPath,
      compliledContractName + ".abi"
    );

    const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

    const iface = new ethers.Interface(abi);
    let deserialTx: TransactionDescription | null = null;
    deserialTx = iface.parseTransaction({ data: txBytes });
    return deserialTx;
  }


  public readFromFile(filename: string) {
    return fs.readFileSync(path.join(this.compiledPath, filename), "utf-8");
  }
  
  
  private async receiveOrder() {
    // await  OrderController.registerIncomingOrder({});
  }
  
  public removeFile(filename: string) {
    return fs.unlinkSync(path.join(this.compiledPath, filename));
  }
  
  private async setSolidityEnv() {
    const util = require("node:util");
    const exec = util.promisify(require("node:child_process").exec);
    await exec("export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/node/.local/bin:/root/.local/bin");
    const env1 = "pip3 install --user solc-select";
    // const env1 = "pip3 install --user solc-select";
    // const env1 = "pip3 install solc-select";
    const env2 = "solc-select install 0.8.4";
    const env3 = "solc-select use 0.8.4";
    try {
      const solcCom = await commandExists("solc-select");
      if (solcCom === null) {
        return await exec(env1 + " && " + env2 + " && " + env3);
      }
    } catch (error: any) {
      console.log("\nContractUtils.setSolidityEnv - ERROR");
      console.log(error);
      console.log("\n\nProbably connection to internet needed to install and configure solc-select");
      console.log("\n");
    }
  }

  private writeToFile(filename: string, data: any) {
    fs.writeFile(
      path.join(this.compiledPath, filename),
      data,
      () => { }
    );
  }
  
}
