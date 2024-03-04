import dotenv from "dotenv";
import db from "../utils/db.utils";
import { User } from "../model/user.model";
import createHttpError from "http-errors";
import { compareSync, hashSync } from "bcrypt";
import JwtUtilsClass from "../utils/jwt.utils";
import { UserRole } from "@prisma/client";
import UserService from "./user.service";

dotenv.config();

class authService {
  static async register(data: User) {
    const email = data.email; 

    const user = await UserService.findUserByEmail(email);

    if (!user) {
      data.password = hashSync(data.password, 8);    
      const newUser = await UserService.createUser(data);       
      data.id = newUser.id;
      return data;
    } else {
      return null;
    }
  }

  static async login(data: User) {
    const email = data.email;
    const password = data.password;
    
    const userObj: User | null = await UserService.findUserByEmail(email);

    if (!userObj) {
      throw createHttpError.NotFound("User not registered");
    } 
      
    const checkPassword = compareSync(password, userObj.password);
    
    if (!checkPassword) {
      throw createHttpError.Unauthorized("Email address or password not valid");
    }
    // clear refresh token from previous login
    userObj.refreshToken = "";
    // remove password field
    const { password: _, ...user } = userObj;

    // create tokens
    const accessToken = await JwtUtilsClass.generateAccessToken(user);
    const refreshToken: any = await JwtUtilsClass.generateRefreshToken({
      email: user.email,
      role: user.role
    });   

    user.refreshToken = refreshToken;   
    
    return { user, accessToken };
  }  

}

export default authService;
