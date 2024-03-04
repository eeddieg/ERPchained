import axios from "axios";
import dotenv from "dotenv";
// import store from "@/store";
// import router from "@/router";

dotenv.config();

const headers = {
  "Content-Type": "application/json",
};

const Axios = axios.create({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // baseURL: process.env.BACKEND_SERVER_BASE_URL || "http://192.168.10.3:4001/api",
  baseURL: process.env.BACKEND_SERVER_BASE_URL || "http://dev.erp.com:4001/api",
  headers,
});

// Axios.interceptors.response.use(
//   (response) => {
//     const code = response.data.statusCode;
//     if (code !== 200) {
//       store.dispatch("logout");
//       router.push("/login");
//     }
//     return response;
//   },
//   (error) => {
//     // if (error) {
//     // if (error.response && error.response.data) {
//     //   return Promise.reject(error.response.data);
//     // }
//     // return Promise.reject(error.message);
//     return Promise.reject(error);
//   }
// );

export default Axios;
