import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import OrderController from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.get("/customers", authMiddleware.verify, OrderController.getCustomerList);
orderRouter.get("/inventory", authMiddleware.verify, OrderController.getCustomerInventory);
orderRouter.patch("/update", authMiddleware.verify, OrderController.updateOrder);
orderRouter.patch("/updateDeliveryDate", authMiddleware.verify, OrderController.updateOrderDeliveryDate);
orderRouter.patch("/updateInventory", authMiddleware.verify, OrderController.updateInventory);
orderRouter.patch("/updateInventoryResourceId", authMiddleware.verify, OrderController.updateInventoryResourceId);
orderRouter.post("/createCustomer", authMiddleware.verify, OrderController.createCustomer);
orderRouter.post("/createOrder", authMiddleware.verify, OrderController.createOrder);
orderRouter.post("/createCustomerFromIncomingOrder", authMiddleware.verify, OrderController.createCustomerFromIncomingOrder);
orderRouter.post("/customerByEmail", authMiddleware.verify, OrderController.getCustomerByEmail);
orderRouter.post("/customerById", authMiddleware.verify, OrderController.getCustomerById);
orderRouter.post("/deleteOrder", authMiddleware.verify, OrderController.deleteOrder);
orderRouter.post("/order/customer", authMiddleware.verify, OrderController.getSingleOrderByCustomerEmail);
orderRouter.post("/order", authMiddleware.verify, OrderController.getOrderByOrderId);
orderRouter.post("/orderReceiptByOrderId", authMiddleware.verify, OrderController.getOrderReceiptByOrderId);
orderRouter.post("/orders", authMiddleware.verify, OrderController.getAllOrdersByCustomerEmail);
orderRouter.post("/ordersByCustomerId", authMiddleware.verify, OrderController.getAllOrdersByCustomerId);
orderRouter.post("/resourceByOrderId", authMiddleware.verify, OrderController.getResourcesByOrderId);
orderRouter.post("/resourcesByCustomerId", authMiddleware.verify, OrderController.getResourcesByCustomerId);
orderRouter.post("/storeReceipt", authMiddleware.verify, OrderController.storeOrderTransactionReceipt);

export default orderRouter;
