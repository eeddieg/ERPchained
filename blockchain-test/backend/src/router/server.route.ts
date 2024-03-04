import { NextFunction, Request, Response, Router } from "express";
import { ServerController } from "../controllers/server.controller";

const serverRouter = Router();

serverRouter.get("/maxBlockNumber", ServerController.getMaxBlockNumber);
serverRouter.get("/transactions", ServerController.getTransactionCountByAddress);
serverRouter.post("/accounts", ServerController.getAccountsList);
serverRouter.post("/blockInfoByTransactionHash", ServerController.fetchBlockInfoByTransactionHash);
serverRouter.post("/blockByNumber", ServerController.fetchBlockByNumber);
serverRouter.post("/deserialize", ServerController.deserialize);
serverRouter.post("/receipt", ServerController.fetchTransactionReceipt);

export default serverRouter;
