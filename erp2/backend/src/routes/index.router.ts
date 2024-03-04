import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import createHttpError from "http-errors";
import accountRouter from "./account.router";
import orderRouter from "./order.router";
import tokenRouter from "./token.router";
import userRouter from "./user.router";

const router = Router();
router.get("/", async(req: Request, res: Response) => {
  const message = {    
    message: "API created for the needs of MSc project",
    title: "Supply Chain and Blockchain technology",
    name: "Georgios Lagoumitzis",
    date: new Date("2023-05-15").toDateString(),
  };
  res.status(200).send(message);
});

router.use("/account", accountRouter);
router.use("/order", orderRouter);
router.use("/token", tokenRouter);
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
