import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const headers = {
  "Content-Type": "application/json",
};

const AxiosBc = axios.create({
  baseURL:
    process.env.BLOCKCHAIN_SERVER_BASE_URL ||
    "http://dev.erp.com:3001/blockchain/api",
  // "http://192.168.11.2:3001/blockchain/api",
  headers,
});

export default AxiosBc;
