import { Router } from "express";
import UserController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import tokenRouter from "./token.router";
const userRouter = Router();

userRouter.use("/", tokenRouter);
// get number of available users from db
userRouter.get("/countUsers", authMiddleware.verify, UserController.countUsers);
// authenticated user get profile info
userRouter.get("/info", authMiddleware.verify, UserController.getUserProfileInfo);
// get all users from db
// userRouter.get("/listUsers", UserController.getUsers);
userRouter.get("/listUsers", authMiddleware.verify, UserController.getUsers);
// login
userRouter.post("/login", authController.login);
//register
userRouter.post("/register", authController.register);

export default userRouter;
