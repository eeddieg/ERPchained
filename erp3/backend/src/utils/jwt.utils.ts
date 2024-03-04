import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import { User } from "../model/user.model";

dotenv.config();

const accessTokenDuration = process.env.ACCESS_TOKEN_DURATION as string;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as jwt.Secret;
const refreshTokenDuration = process.env.REFRESH_TOKEN_DURATION as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as jwt.Secret;

class JwtUtilsClass {
  static generateAccessToken(payload: Object | User) {
    const duration = accessTokenDuration;
    return new Promise((resolve, reject) => {
      jwt.sign(
        { payload },
        accessTokenSecret,
        { expiresIn: duration },
        (err, token) => {
          if (err) {
            reject(createHttpError.InternalServerError());
          }
          resolve(token);
        }
      );
    });
  };

  static generateRefreshToken(payload: Object | User) {
    const duration = refreshTokenDuration;
    return new Promise((resolve, reject) => {
      jwt.sign(
        { payload },
        refreshTokenSecret,
        { expiresIn: duration },
        (err, token) => {
          if (err) {
            reject(createHttpError.InternalServerError());
          }
          resolve(token);
        }
      );
    });
  };

  static verifyAccessToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, accessTokenSecret, (err, data) => {
        if (err) {
          const message =
            err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
          return reject({ 
            status: false,  
            message: createHttpError.Unauthorized(message),
          });
        }
        resolve({ 
          status: true,
          message: "Valid access token", 
          data 
        });
      });
    });
  };

  static verifyRefreshToken(token: string): Promise<any> {    
    return new Promise((resolve, reject) => {
      jwt.verify(token, refreshTokenSecret, (err, payload) => {
        if (err) {
          // Invalid refresh token 
          const message = err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
          return reject(createHttpError.Unauthorized(message));
        } else {
          resolve({
            status: true,
            message: "Valid refresh token",
            payload
          });
        }

      });
    });
  };

}

export default JwtUtilsClass;
