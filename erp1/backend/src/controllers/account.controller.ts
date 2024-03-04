import { NextFunction, Request, Response } from "express";
import AccountService from "../services/account.service";
import createHttpError from "http-errors";
import { AssignedBlockchainAddress } from "../model/assignedBlockchainAddress.model";


export default class AccountController {

  static async getNextAvailabeAddressFromDb(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const unassigned = await AccountService.findNextUnassignedAccount();
      if (unassigned !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Next Available blockchain address",
          unassigned,
        }); 
      } else {
        res.status(404).json({
          status: false,
          statusCode: 404,
          message: "No available address. Max limit reached!",
        });
      }
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };

  static async storeAssignedAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    
    try {
      const payload = {
        address: req.body.address as string,
        email: req.body.email as string,
      } as AssignedBlockchainAddress;

      const assigned = await AccountService.storeAssignedBlockchainAddress(payload);

        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Assigned account stored successfully",
          assigned,
        });
    } catch (error: any) {
      console.log("updateAvailableAddressList - ERROR");
      // next(createHttpError(error.statusCode, error.message));
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
  };
};
  