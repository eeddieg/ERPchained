import { NextFunction, Request, Response } from "express";
import { ServerService } from "../services/server.service"; 
import HTTP_RESPONSE from "../model/http.response";

export class ServerController {

  public static async getAccountsList (req: Request, res: Response, next: NextFunction) {
    try {
      const address = req.body.address;
      const list = await ServerService.getAccountsList();
      
      res.status(200).json({
        status: true,
        message: "Availabe Addresses from Ganache",
        accounts: list,
      });
    } catch (error: any) {
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  }

  public static async getMaxBlockNumber(req: Request, res: Response, next: NextFunction) {
    const blockNumber = await ServerService.getMaxBlockNumber();

    res.status(HTTP_RESPONSE.OK).json({
      status: true,
      statusCode: HTTP_RESPONSE.OK,
      message: "Block number (height) of the most recently mined block",
      blockNumber
    });
  };
  
  public static async getTransactionCountByAddress(req: Request, res: Response, next: NextFunction) {
    
    const payload = {
      address: req.body.address as string,
    };

    const transactions = await ServerService.fetchTransactionCountByAddress(payload);

    res.status(HTTP_RESPONSE.OK).json({
      status: true,
      statusCode: HTTP_RESPONSE.OK,
      message: `Number of transactions from address: ${payload.address}`,
      counter: transactions,
    });
  };

  public static async fetchBlockByNumber(req: Request, res: Response, next: NextFunction) {
    let block: any = null;

    const payload = {
      blockNumber: req.body.blockNumber as string,
    };

    try {
      block = await ServerService.fetchBlockByNumber(payload);
    } catch (error: any) {
      console.log("ServerController.fetchBlockByNumber - ERROR\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    if (block !== null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Details for block #${payload.blockNumber}`,
        block
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 404,
        message: `Could not find block with number ${payload.blockNumber}`,
      });
    }     
  };

  public static async fetchBlockInfoByTransactionHash(req: Request, res: Response, next: NextFunction) {
    let info: any = null;

    const payload = {
      hash: req.body.hash as string,
    };

    console.log(payload);
    try {
      info = await ServerService.fetchBlockInfoByTransactionHash(payload);
    } catch (error: any) {
      console.log("ServerController.fetchBlockInfoByTransactionHash - ERROR\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    if (info !== null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Details for block #${info.blockNumber} using hash ${payload.hash}`,
        info
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 404,
        message: `Could not find block using hash value ${payload.hash}`,
      });
    }     
  };

  public static async fetchTransactionReceipt(req: Request, res: Response, next: NextFunction) {
    let info: any = null;

    const payload = {
      hash: req.body.hash as string,
    };

    try {
      info = await ServerService.fetchTransactionReceipt(payload);
    } catch (error: any) {
      console.log("ServerController.fetchTransactionReceipt - ERROR\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    if (info !== null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Receipt for block #${info.blockNumber} using hash ${payload.hash}`,
        info
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 404,
        message: `Could not find block using hash value ${payload.hash}`,
      });
    }     
  };
  
  public static async deserialize(req: Request, res: Response, next: NextFunction) {
    let block: any = null;
    let result: any = null;

    const blockPayload = {
      hash: req.body.tx as string,
    };
    try{
      block = await ServerService.fetchBlockInfoByTransactionHash(blockPayload);
    } catch (error: any) {
      console.log("ServerController.parseTransaction: blockInfo - ERROR\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      });
    }

    if (block !== null) {
      const transPayload = {
        txBytes: block.data,
        signature: block.signature
      };

      try {
        result = await ServerService.parseTransaction(transPayload);
      } catch (error: any) {
        console.log("ServerController.parseTransaction: parse - ERROR\n");
        res.status(200).json({
          status: false,
          statusCode: error.statusCode,
          message: error.message,
        });
      }

      const data = result.args;
      if (data !== null) {
        const createdAt = Number(data[3]) !== 0 ? new Date(Number(data[3])) : null;
        const deliveredAt = Number(data[4]) !== 0 ? new Date(Number(data[4])) : null;

        const order = {
          id: Number(String(data[0]).split("_")[3]),
          customerId: Number(String(data[1]).split("_")[3]),
          resourceId: Number(String(data[2]).split("_")[3]),
          createdAt,
          deliveredAt,
          type: data[5] as string,
          status: data[6] as string,
        };
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: `Deserialized data for transaction: ${blockPayload.hash}`,
          order
        });
      } else {
        res.status(200).json({
          status: true,
          statusCode: 404,
          message: `Could not locate the data based on transaction hash ${blockPayload.hash}`,
        });
      }
    } else {
      res.status(200).json({
        status: true,
        statusCode: 404,
        message: `Could not find any block based on transaction hash ${blockPayload.hash}`,
      });
    }
   
  };

};
