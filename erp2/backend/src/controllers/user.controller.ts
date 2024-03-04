import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import createHttpError from "http-errors";
import { User } from "../model/user.model";


class UserController {
  //Auth user only: Find use by email
  static async getUserProfileInfo (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.body.email; 
      UserService.findUserByEmail(email).then((user) => {
        const { password: _, ...userFixed } = user as User;
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "User Profile info",
          data: userFixed,
        })
      }); 
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };

  static async countUsers (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const counter = await UserService.countAllUsers();
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Count available users",
          counter: counter,
        }); 
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
  //Auth user only: Find use by email
  static async getUsers (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const userList = await UserService.getAllUsers()

        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "List of available users",
          userList,
        });

 
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
}

export default UserController;
