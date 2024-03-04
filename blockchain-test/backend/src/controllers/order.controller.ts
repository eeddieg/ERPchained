import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import createHttpError from "http-errors";
import { CustomerBc, OrderBc } from "../model/order.model";

export class OrderController {

  public static async emitBuyerInfo(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    const company = req.body.company as string;
    const customerId = company + "_CustomerId_" + req.body.id;    
    const payload = {
      address: req.body.address as string,
      id: customerId as string,
      name: req.body.name as string,
      email: req.body.email as string,
      company: company as string,
    };

    try {
      result = await OrderService.emitBuyerInfo(payload);
    } catch (error: any) {
      console.log("OrderController.emitBuyerInfo - ERROR");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    const { transaction, receipt, error } = result;
    // console.log("\n\ntransaction");
    // console.log(transaction);
    // console.log("\n\nreceipt");
    // console.log(receipt);
    // console.log("\n\nerror");
    // console.log(error);
    // console.log("\n\n");        

    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Customer info: Event triggered successfully",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Event customer: Receipt is null",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };

  public static async emitResourceInfo(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    const company = req.body.company as string;
    const customerId = company + "_CustomerId_" + req.body.id;    
    const payload = {
      address: req.body.address as string,
      company: company as string,
      amount: req.body.amount as number,
    };

    try {
      result = await OrderService.emitResourceInfo(payload);
    } catch (error: any) {
      console.log("OrderController.emitResourceInfo - ERROR");
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    const { transaction, receipt, error } = result;
    // console.log("\n\ntransaction");
    // console.log(transaction);
    // console.log("\n\nreceipt");
    // console.log(receipt);
    // console.log("\n\nerror");
    // console.log(error);
    // console.log("\n\n");        

    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Resource info: Event triggered successfully",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Event Resource: Receipt is null",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };
  
  public static async emitInformSeller(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    const payload = {
      address: req.body.address as string,
      seller: req.body.seller as string,
      sellerEmail: req.body.sellerEmail as string,
      buyer: req.body.buyer as string,
      buyerEmail: req.body.buyerEmail as string,
      amount: req.body.amount as number,
      productBought: req.body.productBought as string,
    };

    try {
      result = await OrderService.emitInformSeller(payload);
    } catch (error: any) {
      console.log("OrderController.emitInformSeller - ERROR");
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    const { transaction, receipt, error } = result;
    // console.log("\n\ntransaction");
    // console.log(transaction);
    // console.log("\n\nreceipt");
    // console.log(receipt);
    // console.log("\n\nerror");
    // console.log(error);
    // console.log("\n\n");        

    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "InformSeller info: Event triggered successfully",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Event InformSeller: Receipt is null",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };
  
  public static async fetchCustomerInfoByEmail(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    try {
      const payload = {
        address: req.body.address as string,
        email: req.body.email as string,
      }

      result = await OrderService.fetchCustomerInfoByEmail(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    if (result !== null) {
      if (result.reason === null || result.reason === undefined) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: `Customer with email: ${req.body.email} found`,
          customer: result
        });
      } else {
        res.status(200).json({
          status: true,
          statusCode: 500,
          message: result.reason,
          customer: null,
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: `Could not find any customer with email: ${req.body.email}`,
        customer: null,
      });
    }     
  };

  public static async fetchCustomers(req: Request, res: Response, next: NextFunction) {
    let customers: CustomerBc[] = [];

    try {
      
      const payload = {
        address: req.body.address as string,
        company: req.body.company as string,
      };

      customers = await OrderService.fetchCustomerList(payload) as CustomerBc[];
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    if (customers.length > 0) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Customer list for company ${req.body.company} found`,
        customers
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: `Could not find any customers for company ${req.body.company}`,
      });
    }     
  };
  
  public static async fetchOrderById(req: Request, res: Response, next: NextFunction) {
    let order: any = null;

    try {
      const company = req.body.company as string;
      const orderId = company + "_OrderId_" + req.body.orderId;

      const payload = {
        address: req.body.address as string,
        orderId: orderId as string,
      };

      order = await OrderService.fetchOrderById(payload) as OrderBc | null;
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    if (order !== null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Order with ID: ${req.body.orderId} found`,
        order
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 404,
        message: `Could not find order with ID: ${req.body.orderId}`,
      });
    }     
  };

  public static async fetchOrdersByCustomerEmail(req: Request, res: Response, next: NextFunction) {
    let orders: any = null;

    try {
      const company = req.body.company as string;

      const payload = {
        address: req.body.address as string,
        company: req.body.company as string,
        email: req.body.email as string,
      };

      orders = await OrderService.fetchOrdersByCustomerEmail(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    if (orders.length > 0) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Orders of Customer with email: ${req.body.email} found`,
        orders
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: `Could not find orders of customer with email: ${req.body.email}`,
      });
    }
  };

  public static async fetchOrdersByCustomerId(req: Request, res: Response, next: NextFunction) {
    let orders: any = null;

    try {
      const company = req.body.company as string;
      const id = company + "_CustomerId_" + req.body.customerId;

      const payload = {
        address: req.body.address as string,
        customerId: id as string,
      };

      orders = await OrderService.fetchOrdersByCustomerId(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    if (orders.length > 0) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Orders of Customer with ID: ${req.body.customerId} found`,
        orders
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: `Could not find orders of customer with ID: ${req.body.customerId}`,
      });
    }
  };
  
  public static async registerCustomer(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    try {
      const company = req.body.company as string;
      const id = company + "_CustomerId_" + req.body.id;
      
      const payload = {
        address: req.body.address as string,
        id: id as string,
        name: req.body.name as string,
        email: req.body.email as string,
        company: company as string,
      };
      
      result = await OrderService.registerCustomer(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
    
    const { transaction, receipt, error } = result;
        
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Customer registered on blockchain",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Customer is already registered on blockchain",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };

  public static async registerIncomingOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const seller = req.body.seller;

      const data = await OrderService.receiveIncomingOrder(seller);
      
      if(data !== null){
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Incoming Order",
          order: JSON.parse(data),
        });
      } else {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "No incoming order",
          order: null,
        });
      }
    } catch (error: any) {
      console.log("ERROR - Can not read file\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
  
  public static async registerResource(req: Request, res: Response, next: NextFunction) {
    let result: any = null;

    try {
      const company = req.body.company as string;
      const id = company + "_ResourceId_" + req.body.resourceId;
    
      const payload = {
        address: req.body.address as string,
        resourceId: id as string,
        product: req.body.product as string,
        amount: req.body.amount as number,
      };
      result = await OrderService.registerResource(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      console.log(error);
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    const { transaction, receipt, error } = result;

    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Resource registered on blockchain",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Resource cannot be registered on blockchain. Perhaps is registered already",
          receipt,
          transaction
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 403,
        message: "Resource already registered on blockchain",
        error
      }); 
    }
  };
  
  public static async registerOrder(req: Request, res: Response, next: NextFunction) {
    let result: any;

    try {
      const company = req.body.company as string;
      const customerId = company + "_CustomerId_" + req.body.customerId;
      const orderId = company + "_OrderId_" + req.body.orderId;
      const resourceId = company + "_ResourceId_" + req.body.resourceId;

      const payload = {
        address: req.body.address as string,
        orderId: orderId as string,
        customerId: customerId as string,
        resourceId: resourceId as string,
        createdAt: req.body.createdAt as number,
        deliveredAt: req.body.deliveredAt as number,
        orderType: req.body.orderType as string,
        orderStatus: req.body.orderStatus as string,
      };

      result = await OrderService.registerOrder(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
        error
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    const { transaction, receipt, error } = result;
      
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Order registered on blockchain",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 400,
          message: "Order is missing resource registered on blockchain",
        });
      }
    } else {
      console.log("ERROR: Order probably is already registered on blockchain\n");
      console.log(error);
      res.status(200).json({
        status: false,
        statusCode: 403,
        message: error.message,
        error
      });
    }
  };

  public static async retrieveEverything(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    try {      
      const payload = {
        address: req.body.address as string,
        company: req.body.company as string,
      };

      result = await OrderService.retrieveEverything(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
    
    if (result.length > 0) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Customers and orders fetched successfully from blockchain",
        result
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: "Could not fetch customers and orders from blockchain",
      });
    }     
  };

  public static async updateDeliveryDate(req: Request, res: Response, next: NextFunction) {
    let result: any;

    try {
      const company = req.body.company as string;
      const orderId = company + "_OrderId_" + req.body.orderId;

      const payload = {
        address: req.body.address as string,
        orderId: orderId as string,
        deliveredAt: req.body.deliveredAt as number,
      };

      result = await OrderService.updateDeliveryDate(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    const { transaction, receipt, error } = result;
      
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Order delivery date updated on blockchain successfully",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 400,
          message: "Order is not registered on blockchain",
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 403,
        message: "",
        error
      });
    }
  };
  
  public static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    let result: any;

    try {
      const company = req.body.company as string;
      const orderId = company + "_OrderId_" + req.body.orderId;

      const payload = {
        address: req.body.address as string,
        orderId: orderId as string,
        status: req.body.status as string,
      };

      result = await OrderService.updateOrderStatus(payload);
    } catch (error: any) {
      console.log("ERROR: Calling contract failed\n");
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
        error,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }

    const { transaction, receipt, error } = result;
      
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Order status updated on blockchain successfully",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 400,
          message: "Order is not registered on blockchain",
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 403,
        message: "",
        error
      });
    }
  };

};
