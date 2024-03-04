import { Router } from "express";
import tokenController from "../controllers/token.controller";
import authMiddleware from "../middleware/auth.middleware";
const tokenRouter = Router();

// verify
// tokenRouter.post("/verify", authMiddleware.verify, tokenController.refresh);
// refresh JWT
tokenRouter.post("/verify", authMiddleware.verify, tokenController.verify);
// refresh JWT
tokenRouter.post("/refresh", authMiddleware.verify, tokenController.refresh);
// generate MFA token and QR
tokenRouter.post("/generateQR", authMiddleware.verify, tokenController.generateTwoFactorAuth);
// check MFA status
tokenRouter.post("/mfaStatus", authMiddleware.verify, tokenController.checkMFAStatus);
// verify user token against QR
tokenRouter.post("/verifyQR", authMiddleware.verify, tokenController.verifyTwoFactorAuth);
// clear MFA entries
tokenRouter.post("/reset", authMiddleware.verify, tokenController.reset);


export default tokenRouter;
