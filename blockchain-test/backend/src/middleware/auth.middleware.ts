import JwtUtilsClass from "../utils/jwt.utils";
import createHttpError = require("http-errors");
import { Request, Response, NextFunction } from "express";

class authMiddleware {

  static async verify(req: Request, res: Response, next: NextFunction) {    
    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {

      const bearerToken = req.headers.authorization.split(" ")[1];
      
      try {
        const results: any = await JwtUtilsClass.verifyAccessToken(bearerToken);
        
        if (results.status === true) {
          next();
        }
      } catch (error) {
        res.status(401).json({
          status: false,
          message: "Invalid token",
        });
      }
    } else {
      res.status(401).json({
        status: false,
        message: "Access token is required",
      });
    }

  };  
}

export default authMiddleware;
