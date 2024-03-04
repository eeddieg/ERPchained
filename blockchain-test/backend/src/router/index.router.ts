import createHttpError from "http-errors";
import { Request, Response, Router, NextFunction } from "express";
import orderRouter from "./orders.route";
import serverRouter from "./server.route";
import userRouter from "./user.route";
import companyRouter from "./company.router";

const router = Router();
router.use(/.$/, async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: true,
    developer: "Georgios Lagoumitzis",
    title: "Blockchain API",
    scope: "MSc CyberSecurity and Data Science",
    created: "2023-07",
  });
});

router.use("/company", companyRouter);
router.use("/order", orderRouter);
router.use("/server", serverRouter);
router.use("/user", userRouter);

router.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError.NotFound("Route not Found"));
});

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
      status: false,
      code: err.status || 500,
      message: err.message
  })
})

export default router;
