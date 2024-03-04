import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.patch("/updateDeliveryDate", OrderController.updateDeliveryDate);
orderRouter.patch("/updateOrderStatus", OrderController.updateOrderStatus);
orderRouter.post("/customerInfoByEmail", OrderController.fetchCustomerInfoByEmail);
orderRouter.post("/customers", OrderController.fetchCustomers);
orderRouter.post("/emitBuyerInfo", OrderController.emitBuyerInfo);
orderRouter.post("/emitResourceInfo", OrderController.emitResourceInfo);
orderRouter.post("/emitInformSeller", OrderController.emitInformSeller);
orderRouter.post("/ordersByCustomerEmail", OrderController.fetchOrdersByCustomerEmail);
orderRouter.post("/ordersByCustomerId", OrderController.fetchOrdersByCustomerId);
orderRouter.post("/orderById", OrderController.fetchOrderById);
orderRouter.post("/registerCustomer", OrderController.registerCustomer);
orderRouter.post("/registerIncomingOrder", OrderController.registerIncomingOrder);
orderRouter.post("/registerOrder", OrderController.registerOrder);
orderRouter.post("/registerResource", OrderController.registerResource);
orderRouter.post("/retrieveAll", OrderController.retrieveEverything);

export default orderRouter;
