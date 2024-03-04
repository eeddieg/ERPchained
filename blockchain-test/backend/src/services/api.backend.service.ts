import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const headers = {
  "Content-Type": "application/json",
};

const Axios = axios.create({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  baseURL: process.env.BACKEND_SERVER_BASE_URL || "http://192.168.10.3:4001/api",
  // baseURL: process.env.BACKEND_SERVER_BASE_URL || "http://dev.erp.com:3000/api",
  headers,
});

export default Axios;
