import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import createHttpError from "http-errors";
import AccountService from "../services/account.service";
import BlockChainService from "../services/blockchain.service";
import UserService from "../services/user.service";
import MfaService from "../services/mfa.service";
import { MFA } from "../model/mfa.model";
import { User } from "../model/user.model";
import dotenv from "dotenv";

import * as sp from "speakeasy";
import * as qrcode from "qrcode";
import { AssignedBlockchainAddress } from "@/model/assignedBlockchainAddress.model";
class authController {

  static async register(req: Request, res: Response, next: NextFunction) {
    dotenv.config();
    try {
      const counter = await AccountService.countAccounts();
      const unassignedAccount = await AccountService.findNextUnassignedAccount();

      // const accounts = await BlockChainService.getAccounts();
      // check ganache -a option 
      const accLimit = parseInt(process.env.GANACHE_ACCOUNT_LIMIT!);
      if (counter >= accLimit) {
        res.status(503).json({
          status: false,
          statusCode: 503,
          message: "Blockchain account limits exceeded!",
        });
      }
      if (unassignedAccount == null) {
        res.status(507).json({
          status: false,
          statusCode: 507,
          message: "Cannot find an avalailable Blockchain account.",
        });
      }

      const userData: User = {
        firstName: req.body.firstName || null,
        lastName: req.body.lastName || null,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        refreshToken: req.body.refreshToken || "",
        mfaId: req.body.mfaId || null,
        address: unassignedAccount!.address,
      };
      const user = await authService.register(userData);

      const payload = {
        address:unassignedAccount?.address as string,
        email: user!.email as string,
      }as AssignedBlockchainAddress;

      await AccountService.storeAssignedBlockchainAddress(payload);
      
      if (user) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "User created successfully",
          user,
        });
      } else if (user === null) {
        res.status(409).json({
          status: false,
          statusCode: 409,
          message: "User already exists.",
        });
      }
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      });    
      // next(createHttpError(e.statusCode, e.message));
    }
  };

  // Login user
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken } = await authService.login(req.body);
      //store refresh token to db
      const id = user.id as number;
      const data = {
        refreshToken: user.refreshToken,
      }
      await UserService.updateUser(id, data);
      // await UserService.storeRefreshToken(user.email, user.refreshToken as string);

      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Account login successful",
        data: user,
        accessToken
      });
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(e.statusCode, e.message));
    }
  };

  static async generateTwoFactorAuth(req: Request, res: Response, next: NextFunction) {
    // check if token is about to expire 
    const email = req.body.email as string;

    const secret = sp.generateSecret();
    qrcode.toDataURL(secret.otpauth_url!, (err: any, qrImage: any) => {
      if (!err) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          data: {
            secret: secret,
            qr: qrImage,
          }
        });

      } else {
        res.status(500).json({
          status: false,
          statusCode: 500,
          message: "Internal Server Error."
        });
      }
    });

  };
}

export default authController;
