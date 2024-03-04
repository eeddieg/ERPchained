import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import AccountController from "../controllers/account.controller";

const AccountRouter = Router();

AccountRouter.get("/nextUnassigned", authMiddleware.verify, AccountController.getNextAvailabeAddressFromDb);
AccountRouter.post("/storeAssignedAddress", authMiddleware.verify, AccountController.storeAssignedAddress);

export default AccountRouter;