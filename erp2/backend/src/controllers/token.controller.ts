import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import JwtUtilsClass from "../utils/jwt.utils";
import createHttpError from "http-errors";
import UserService from "../services/user.service";
import MfaService from "../services/mfa.service";
import { Request, Response, NextFunction } from "express";
import * as sp from "speakeasy";
import * as qrcode from "qrcode";
import { MFA } from "../model/mfa.model";
import { MFAuthenticationClass } from "../utils/mfa.utils";
import UserController from "./user.controller";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as jwt.Secret;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as jwt.Secret;

class tokenController {
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // if token is present
      if (req.headers && req.headers.authorization && req.body.refreshToken) {
        const email: string = req.body.email;
        const userObj = await UserService.findUserByEmail(email);
        if (userObj) {
          const refreshToken = userObj.refreshToken as string;
          // if submited token is the same as the stored one
          if (req.body.refreshToken === userObj.refreshToken) {
            const isValid = await JwtUtilsClass.verifyRefreshToken(refreshToken);
            if (isValid.status === true) {
              // remove password field
              const { password: _, ...user } = userObj;

              const accessToken = await JwtUtilsClass.generateAccessToken(user);
              req.body.data = userObj;
              req.body.accessToken = accessToken;
              res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Access token created successfully.",
                accessToken
              });
            } else {
              res.status(403).json({
                status: false,
                message: "Invalid refresh token. Please login again."
              });
            }
          } else {
            res.status(401).json({
              status: false,
              statusCode: 401,
              message: "Invalid refresh token.",
            });
          }
        } else {
          res.status(404).json({
            status: false,
            statusCode: 404,
            message: "User not found.",
          });
        }
      } else {
        res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Bad request",
        });
      }
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(err.statusCode, err.message));
    }
  };

  static async checkMFAStatus(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email as string;

    const user = await UserService.findUserByEmail(email);
    if (user != null) {
      const userId = user.id as number;
      const mfa = await UserService.findUserMFAStatus(userId) as MFA;

      res.status(200).json({
        status: true,
        statusCode: 200,
        mfa
      });
    } else {
      res.status(404).json({
        status: true,
        statusCode: 200,
        message: "Entity not found."
      });
    }
  };

  static async generateTwoFactorAuth(req: Request, res: Response, next: NextFunction) {
    const user = await UserService.findUserByEmail(req.body.email)!;
    const email = user?.email as string;


    const secret = await sp.generateSecret({
      name: "ERP-Chain",
      issuer: email,
    });

    qrcode.toDataURL(secret.otpauth_url!, (err: any, qrImage: any) => {
      if (!err) {
        const mfa: MFA = {
          userId: user!.id as number,
          status: true,
          verified: false,
          ascii: secret.ascii!,
          hex: secret.hex!,
          base32: secret.base32!,
          otpAuthUrl: secret.otpauth_url!,
          qr: qrImage,
        };

        //update DB
        MfaService.storeMFA(mfa).then((updatedMfa) => {
          const mfa = updatedMfa;
          res.status(200).json({
            status: true,
            statusCode: 200,
            mfa
          });
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

  static async verify(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Token is valid",
    });
  };

  static async verifyTwoFactorAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const mfaId = req.body.id as number;
      const userId = req.body.userId as number;
      const token = req.body.token as string;
      const base32Secret = req.body.base32Secret as string;

      let mfa = await MfaService.findMFAById(mfaId);
      const storedBase32Secret = mfa?.base32;

      if (storedBase32Secret === base32Secret) {
        const validationData = {
          token,
          base32Secret,
        }

        // console.log(validationData);
        const verified = MFAuthenticationClass.verifyTwoFactor(validationData);
        console.log("verifyTwoFactor: " + verified);

        if (verified) {
          const userData = {
            mfaId: mfaId,
          };

          await UserService.updateUser(userId, userData);
          const mfaData = {
            id: mfaId,
            verified: verified,
          };

          mfa = await MfaService.updateMfaTable(mfaData);
          // console.log(mfa);
          res.status(200).json({
            status: true,
            statusCode: 200,
            mfa
          });
        } else {
          // console.log(mfa);
          res.status(401).json({
            status: false,
            statusCode: 401,
            data: mfa
          });
        }
      } else {
        res.status(304).json({
          status: true,
          statusCode: 304,
          data: mfa
        });
      }
    } catch (error:any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
  };

  static async reset(req: Request, res: Response, next: NextFunction) {
    try {
      const bearerToken = req.headers.authorization!.split(" ")[1];
      const mfaId = req.body.id as number;
      const userId = req.body.userId as number;

      const data = {
        id: req.body.id,
        userId: req.body.userId,
      }

      const storedMfa = await MfaService.findMFAById(mfaId);
      let mfa: any;
      mfa = null;
      if (storedMfa != null) {
        mfa = await MfaService.reset(mfaId);

        const userData = {
          mfaId: null
        };
        await UserService.updateUser(userId, userData);
      }

      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "MFA entries cleared"
      });

    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
  };

}

export default tokenController;
