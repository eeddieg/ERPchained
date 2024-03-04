import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/enroll", UserController.enrollUser);
userRouter.post("/info", UserController.getUserInfo);
userRouter.post("/getAuthStatus", UserController.getAuthStatus);
userRouter.post("/setAuthStatus", UserController.setAuthStatus);

export default userRouter;
