import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import logger from "./src/middleware/logger.middleware";
import handleError from "./src/middleware/error.middleware";
import router from "./src/router/index.router";
import { ContractUtils } from "./src/utils/contract.utils";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) | 3001;
const uriPath = "/blockchain/api";

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(handleError);

// compile and deploy smart contract
const contrUtils = new ContractUtils();
contrUtils.enableContracts();

app.use(`${uriPath}`, router);

const server = app.listen(PORT, () => {
  console.log(`\nAPI Server started on http://localhost:${PORT}${uriPath}\n`);
});

// const io = new Server(server);
// io.on("connection", (socket) => {
//   console.log("Socket connection established\n");
//   console.log(socket);
// });
