import { Customer, Inventory, Order, Receipt, Resource } from "../model/order.model";
import { NextFunction, Request, Response } from "express";
import { AssignedBlockchainAddress, OrderStatus, OrderType, Product } from "@prisma/client";
import AccountService from "../../src/services/account.service";
import createHttpError from "http-errors";
import OrderService from "../services/order.service";

class OrderController {

  static async assignAddress(email: string){
    const addrObj = await AccountService.findNextUnassignedAccount();
    if (addrObj !== null) {
      const payload = {
        address: addrObj!.address as string,
        email: email as string
      } as AssignedBlockchainAddress;
      return await AccountService.storeAssignedBlockchainAddress(payload);
    }
  }

  static async createPlainCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {

    const address = req.body.address as string;
    const email = req.body.email as string || null;
    const name = req.body.name as string || null;

    const custPayload = {
      address,
      email,
      name,
    };
    const createdCustomer = await OrderService.createPlainCustomer(custPayload)  as Customer || null;   
    
    if (createdCustomer !== null){
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Customer created with ID: #${createdCustomer.id}`,
        customer: createdCustomer,
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: `Customer was not created`,
        customer: null,
      });
    }
  }

  static async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    const customerPayload = {
      name: req.body.name as string,
      email: req.body.email as string,
    } as Customer;
    const createdCustomer = await OrderService.storeCustomer(customerPayload); 
    
    const inventoryPayload = {
       id: createdCustomer.id! as number,
    } as Inventory;
    const invCreated = await OrderService.storeInventory(inventoryPayload);

    const orderPayload = {
      customerId:   createdCustomer.id! as number,
      createdAt: new Date() as Date,
      type: OrderType.INCOMING,
      status: OrderStatus.PLACED
    } as Order;
    const orderCreated = await OrderService.storeOrder(orderPayload);
    
    const resourcesPayload = {
      inventoryId: invCreated.id! as number,
      orderId: orderCreated.id! as number,
      title: req.body.product as string,
      amount: req.body.amount as number,
    } as Resource;
    const resourcesCreated = await OrderService.storeResources(resourcesPayload);
    
    const updatedOrderPayload = {
      deliveredAt: new Date(),
      status: OrderStatus.COMPLETED as string,
      resourceId: resourcesCreated.id! as number,
    };
    const updatedOrder = await OrderService.updateOrderIncludingResourceRelation(orderCreated.id!, updatedOrderPayload);
    
    const updatedInventoryPayload = {
      inventoryId: invCreated.id! as number,
      resourceId: resourcesCreated.id! as number,
    };
    const updatedInventory = await OrderService.updateInventoryResource(updatedInventoryPayload);

    let address = req.body.address as string;
    if (address === undefined) {
      const assignedAddress = await OrderController.assignAddress(createdCustomer!.email as string);
      address = assignedAddress?.address as string;
    }
    
    const updatedCustomerPayload = {
      address,
      orderId: updatedOrder.id! as number,
    };
    const updatedCustomer = await OrderService.updateCustomerInclRelation(createdCustomer.id!, updatedCustomerPayload);

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: `Customer #${createdCustomer.id} created`,
      customer: updatedCustomer,
    });
  }

  static async createCustomerFromIncomingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    const address = req.body.address as string;

    const customerPayload = {
      name: req.body.name as string,
      email: req.body.email as string,
    } as Customer;
    const createdCustomer = await OrderService.storeCustomer(customerPayload); 
    
    const inventoryPayload = {
       id: createdCustomer.id! as number,
    } as Inventory;
    const invCreated = await OrderService.storeInventory(inventoryPayload);

    const orderPayload = {
      customerId:   createdCustomer.id! as number,
      createdAt: new Date() as Date,
      type: OrderType.OUTCOMING,
      status: OrderStatus.PLACED
    } as Order;
    const orderCreated = await OrderService.storeOrder(orderPayload);
    
    const resourcesPayload = {
      inventoryId: invCreated.id! as number,
      orderId: orderCreated.id! as number,
      title: req.body.product as string,
      amount: req.body.amount as number,
    } as Resource;
    console.log("OrderController.createCustomer");
    console.log(resourcesPayload);
    const resourcesCreated = await OrderService.storeResources(resourcesPayload);
    
    const updatedOrderPayload = {
      deliveredAt: new Date(),
      status: OrderStatus.COMPLETED as string,
      resourceId: resourcesCreated.id! as number,
    };
    const updatedOrder = await OrderService.updateOrderIncludingResourceRelation(orderCreated.id!, updatedOrderPayload);
    
    const updatedInventoryPayload = {
      inventoryId: invCreated.id! as number,
      resourceId: resourcesCreated.id! as number,
    };
    const updatedInventory = await OrderService.updateInventoryResource(updatedInventoryPayload);

    const updatedCustomerPayload = {
      address,
      orderId: updatedOrder.id! as number,
    };
    const updatedCustomer = await OrderService.updateCustomerInclRelation(createdCustomer.id!, updatedCustomerPayload);

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: `Customer #${createdCustomer.id} created`,
      customer: updatedCustomer,
    });
  }
  
  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {

    const customerId = req.body.customerId as number;
    const amount = req.body.amount as number;
    const title = req.body.title as Product;

    const orderPayload = {
      customerId: customerId,
      createdAt: req.body.createdAt as Date,
      deliveredAt: req.body.deliveredAt as Date || null,
      type: req.body.type as OrderType,
      status: req.body.status as OrderStatus,
    } as Order;
    const createdOrder = await OrderService.storeOrder(orderPayload);    
    const custInventory = await OrderService.findCustomerInventory(customerId);
        
    const resourcePayload = {
      inventoryId: custInventory!.id as number,
      orderId: createdOrder.id as number,
      title,
      amount,
    } as Resource;
    const createdResource = await OrderService.storeResources(resourcePayload);
    
    const updateOrderPayload = {
      orderId: createdOrder!.id as number, 
      resourceId: createdResource!.id as number,
    };
    const updatedOrder = await OrderService.updateOrderResourceId(updateOrderPayload);
    
    const updateInventoryPayload = {
      inventoryId: custInventory!.id as number, 
      resourceId: createdResource!.id as number,
    };
    const updatedInv = await OrderService.updateInventoryResource(updateInventoryPayload);

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: `Order #${updatedOrder.id} created`,
      custInventory,
      createdOrder: updatedOrder
    });
  }
  
  static async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {

    const orderId = req.body.orderId as number;
    const order = await OrderService.findOrderByOrderId(orderId);
    
    if (order !== null){
      const deletedOrder = await OrderService.deleteOrder(orderId);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Order #${deletedOrder?.id}deleted`,
        deletedOrder
      });

    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: `No order found with ID: ${orderId}`,
      });
    }
  }

  static async getCustomerByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const email = req.body.email as string;
    try {    
      const customer = await OrderService.fetchCustomerByEmail(email);

      if (customer !== null){
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Customer found in DB",
          customer,
        }); 
      } else {
        res.status(200).json({
          status: false,
          statusCode: 404,
          message: "Customer does not exist in DB",
          customer: null,
        }); 
      }
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };

  static async getCustomerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = req.body.customerId as number;
    try {    
      const customer = await OrderService.fetchCustomerById(id);

      if (customer !== null){
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Customer found in DB",
          customer,
        }); 
      } else {
        res.status(200).json({
          status: false,
          statusCode: 404,
          message: "Customer does not exist in DB",
        }); 
      }
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };

  static async getCustomerList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const customerList = await OrderService.fetchAllCustomers();
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Customer list for company",
        customerList,
      }); 
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
  
  static async getCustomerInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customerId = req.body.customerId;
      const inventory = await OrderService.findCustomerInventory(customerId);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Inventory of customer #${customerId}`,
        inventory,
      }); 
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
  
  static async getResourcesByOrderId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.body.orderId;
      const resource = await OrderService.findAllResourcesByOrderId(id);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Resources list of order #${id}`,
        resource,
      }); 
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
  
  static async getOrderReceiptByOrderId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.body.orderId;
      const receipt = await OrderService.findOrderReceiptByOrderId(id);

      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: `Found receipt with ID #${receipt!.id!}`,
          receipt,
        }); 
      } else {
        res.status(200).json({
          status: true,
          statusCode: 404,
          message: `Receipt with ${id} cannot be found in batabase`,
        }); 
      }
    } catch (error: any) {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
  
  static async getResourcesByCustomerId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customerId = req.body.customerId;
      const inventory = await OrderService.findCustomerInventory(customerId);
      if (inventory !== null){
        const inventoryId = inventory!.id as number;
        const resources = await OrderService.findAllResourcesByInventoryId(inventoryId);
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: `Resources list for customer with ID: #${customerId} and inventory ID: #${inventoryId}`,
          resources
          // resources,
        }); 
        
      } else {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: `No inventory found for customer #${customerId}`,
          inventory
        }); 
      }
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };

  static async getSingleOrderByCustomerEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const email = req.body.email;
      const orderId = req.body.orderId;
      const customer = await OrderService.findCustomerByEmail(email);
      if (customer !== null) {
        const customerId = customer.id as number;
        let order: Order | null = null;
        try {
          order = await OrderService.findSingleOrderByCustomerId(orderId, customerId);
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: `Orders for user: ${email}`,
            customer,
            order
          }); 
        } catch (error: any) {
          res.status(error.statusCode).json({
            status: false,
            statusCode: error.statusCode,
            message: error.message,
          }); 
        }
      } else {
        res.status(404).json({
          status: false,
          statusCode: 404,
          message: "Customer could not be found",
        }); 
      }
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };

  static async getOrderByOrderId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const orderId = req.body.orderId;
      const order = await OrderService.findOrderByOrderId(orderId);
      if (order !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: `Order #${order!.id}`,
          order
        }); 
      } else {
        res.status(200).json({
          status: false,
          statusCode: 404,
          message: "Order could not be found",
        }); 
      }
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };

  static async getAllOrdersByCustomerEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const email = req.body.email;
      if (email === null) {
        res.status(503).json({
          status: true,
          statusCode: 503,
          message: "Bad request: Email missing",
        }); 
      }
      const customer = await OrderService.findCustomerByEmail(email);
      if (customer !== null) {
        const customerId = customer.id as number;
        let orders: Order[] | null = null;
        try {
          orders = await OrderService.findAllOrdersByCustomerId(customerId);
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: `Orders for user: ${email}`,
            customer,
            orders
          }); 
        } catch (error: any) {
          res.status(error.statusCode).json({
            status: false,
            statusCode: error.statusCode,
            message: error.message,
          }); 
        }
      } else {
        res.status(200).json({
          status: false,
          statusCode: 404,
          message: "Customer could not be found",
        }); 
      }
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
    
  static async getAllOrdersByCustomerId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const id = req.body.customerId as number;
      if (id === null) {
        res.status(200).json({
          status: false,
          statusCode: 503,
          message: "Bad request: Customer ID is missing",
        }); 
      }
      const customer = await OrderService.fetchCustomerById(id);
      if (customer !== null) {
        let orders: Order[] | null = null;
        try {
          orders = await OrderService.findAllOrdersByCustomerId(id);
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: `Orders for customer with ID: ${id}`,
            customer,
            orders
          }); 
        } catch (error: any) {
          res.status(error.statusCode).json({
            status: false,
            statusCode: error.statusCode,
            message: error.message,
          }); 
        }
      } else {
        res.status(200).json({
          status: false,
          statusCode: 404,
          message: "Customer could not be found",
        }); 
      }
    } catch (error: any) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
    
  static async storeOrderTransactionReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = {
      orderId: req.body.orderId as number,
      to: req.body.to as string,
      from: req.body.from as string,
      blockHash: req.body.blockHash as string,
      blockNumber: req.body.blockNumber as number,
      status: req.body.status as number,
      hash: req.body.hash as string,
      } as Receipt;
     
      let storedReceipt: Receipt | null = null;
      storedReceipt = await OrderService.findOrderReceiptByOrderId(payload.orderId);

      if (storedReceipt === null) {
        const receiptCreated = await OrderService.storeReceiptToDb(payload);
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Receipt stored in database",
            receipt: receiptCreated,
        });
      } else {
        // console.log("Storing receipt in database failed\n");
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Receipt is already stored in database",
          receipt: storedReceipt,
        });
      }  
    } catch (error: any) {
      console.log("\nOrderController.storeOrderTransactionReceipt - ERROR");
      // next(createHttpError(error.statusCode, error.message));
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error or bad request",
        error
      }); 
    }
  };

  static async updateInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    const orderId = req.body.orderId as number;
    const data = req.body;
    const { orderId: _, ...payload } = data

    try{
      const updatedOrder = await OrderService.updateOrder(orderId, payload);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Order #${updatedOrder!.id} updated`,
        updatedOrder,
      });

    } catch(error: any) {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "OrderController.updateOrder - ERROR",
        error,
      });
      
    }
  }
  
  static async updateInventoryResourceId(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    const orderId = req.body.orderId as number;
    const resourceId = req.body.resourceId as number;

    try{
      const updatedOrder = await OrderService.updateOrder(orderId, resourceId);
      
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Order #${updatedOrder!.id} updated`,
        updatedOrder,
      });

    } catch(error: any) {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "OrderController.updateOrder - ERROR",
        error,
      });
      
    }
  }

  static async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    const orderId = req.body.orderId as number;
    const data = req.body;
    const { orderId: _, ...payload } = data

    console.log(payload);

    try{
      const updatedOrder = await OrderService.updateOrder(orderId, payload);
      
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Order #${updatedOrder!.id} updated`,
        updatedOrder,
      });

    } catch(error: any) {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "OrderController.updateOrder - ERROR",
        error,
      });
      
    }
  }

  static async updateOrderDeliveryDate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const orderPayload = {
      orderId:      req.body.orderId as number,
      deliveredAt:  req.body.deliveredAt as Date,
    };
    
    try{
      const updatedOrder = await OrderService.updateOrderDeliveryDate(orderPayload);

      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Order #${updatedOrder!.id} updated`,
        updatedOrder,
      });

    } catch(error: any) {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "OrderController.updateOrder - ERROR",
        error,
      });
      
    }
  }
}

export default OrderController;
