import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import createHttpError from "http-errors";
import { AuthStatus, Register, RegUserContract, UserRole } from "../model/user.register.contract.model";

export class UserController {
  public static async enrollUser(req: Request, res: Response, next: NextFunction) {
    try {

      const receipt = await UserService.enrollUser(req.body);

      res.status(200).json({
        status: true,
        message: "User enrolled in blockchain",
        receipt
      });
    } catch (error: any) {
      // next(createHttpError(error.statusCode, error.message));
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
  };

  public static async getAuthStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await UserService.getAuthStatus(req.body) as number;

      res.status(200).json({
        status: true,
        message: `User: ${req.body.address} auth status`,
        authStatus: status
      });
    } catch (error: any) {
      // next(createHttpError(error.statusCode, error.message));
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
  };

  public static async setAuthStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const receipt = await UserService.setAuthStatus(req.body);

      res.status(200).json({
        status: true,
        message: `User: ${req.body.address} status modified`,
        receipt
      });
    } catch (error: any) {
      // next(createHttpError(error.statusCode, error.message));
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
  };

  public static async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const tx = await UserService.getUserDetails(req.body) as any;
      if (tx !== null){
        let role: UserRole = UserRole.USER;
        if (tx[4] === "ADMIN") {
          role = UserRole.ADMIN;
        } else if (tx[4] === "MODERATOR") {
          role = UserRole.MODERATOR;
        }
        const user: RegUserContract = {
          address: tx[0] as string,
          id: parseInt(tx[1], 10),
          email: tx[2] as string,
          company: tx[3] as string,
          role: role,
          regStatus: parseInt(tx[5], 10) == 0 ? Register.NO : Register.YES,
          authStatus: parseInt(tx[6], 10) == 0 ? AuthStatus.NO : AuthStatus.YES,
        };
        if (user.id != null ){
          res.status(200).json({
            status: true,
            message: "User details from blockchain",
            user
          });
        } else {
          res.status(404).json({
            status: false,
            message: "User not found on blockchain",
            user: null,
          });
        }
      }  else {
        res.status(404).json({
          status: false,
          message: "User not found on blockchain",
          user: null,
        });
      }
    } catch(error: any) {
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };


};
