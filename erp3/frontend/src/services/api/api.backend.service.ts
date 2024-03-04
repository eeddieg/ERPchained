import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const headers = {
  "Content-Type": "application/json",
};

const Axios = axios.create({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  baseURL: process.env.BACKEND_SERVER_BASE_URL || "http://dev.erp.com:4003/api",
  // process.env.BACKEND_SERVER_BASE_URL || "http://192.168.10.13:4003/api",
  headers,
});

export default Axios;
