import dotenv from "dotenv";
import AxiosBc from "./api.blockchain.service";
import { User } from "../model/user.model";

dotenv.config();

export default class BlockChainService {

  static async getAccounts() {
    dotenv.config();
    const accountsUrl = AxiosBc.defaults.baseURL + "/server/accounts"; 
    const res = await AxiosBc.post(accountsUrl);
    return res.data.accounts;
  }
  
  static async enrollUser(payload: User) {
    dotenv.config();
    const urlbl = AxiosBc.defaults.baseURL + "/user" + "/enroll";
    const receipt = await AxiosBc.post(urlbl, payload);
    return receipt;
  }
  

};
