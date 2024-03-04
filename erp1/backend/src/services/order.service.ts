import db from "../utils/db.utils";
import { Customer, Inventory, Order, Receipt, Resource } from "../model/order.model";
import { OrderStatus, OrderType, Product } from "@prisma/client";

class OrderService {
  static async createPlainCustomer(data: Customer): Promise<Customer | null> {
    return await db.customer.create({
      data: {
        address: data.address as string,
        email: data.email as string || null,
        name: data.name as string || null,
      },
      select: {
        address: true,
        email: true,
        id: true,
        name: true,
      },
    });
  }

  static async deleteOrder(id: number): Promise<Order | null> {
    return await db.order.delete({
      where: {
        id
      },
    });
  }

  // Fetch all customers
  static async fetchAllCustomers(): Promise<Customer[] | null> {
    return await db.customer.findMany();
  };

  static async fetchCustomerByEmail(email: string): Promise<Customer | null> {
    return await db.customer.findUnique({
      where: {
        email,
      }
    });
  };

  static async fetchCustomerById(id: number): Promise<Customer | null> {
    return await db.customer.findUnique({
      where: {
        id,
      }
    });
  };

  // Find all orders based on customer ID
  static async findAllOrdersByCustomerId(id: number): Promise<Order[] | null> {
    return await db.order.findMany({
      where: {
        customerId: id,
      }
    });
  };

  // Find all resources based on inventory ID
  static async findAllResourcesByInventoryId(id: number): Promise<Resource[] | null> {
    return await db.resource.findMany({
      where: {
        inventoryId: id,
      }
    });
  };

  // Find all resources based on order ID
  static async findAllResourcesByOrderId(id: number): Promise<Resource | null> {
    return await db.resource.findFirst({
      where: {
        orderId: id,
      }
    });
  };

  // Find a single user by email
  static async findCustomerByEmail(email: string): Promise<Customer | null> {
    return await db.customer.findUnique({
      where: {
        email
      }
    });
  };

  // Find customer's inventory based on customer ID
  static async findCustomerInventory(id: number): Promise<Inventory | null> {
    return await db.inventory.findUnique({
      where: {
        customerId: id,
      }
    });
  };

  // Find an order based on order ID
  static async findOrderByOrderId(orderId: number): Promise<Order | null> {
    return await db.order.findUnique({
      where: {
        id: orderId,
      }
    });
  };

  // Find customer's inventory based on customer ID
  static async findOrderReceiptByOrderId(id: number): Promise<Receipt | null> {
    return await db.receipt.findUnique({
      where: {
        orderId: id,
      }
    });
  };

  // Find an order based on customer ID
  static async findSingleOrderByCustomerId(orderId: number, customerId: number): Promise<Order | null> {
    return await db.order.findUnique({
      where: {
        id: orderId,
        customerId,
      }
    });
  };

  static async storeCustomer(data: Customer): Promise<Customer> {
    return await db.customer.create({
      data: {
        name: data.name as string,
        email: data.email as string,
      },
      select: {
        id:      true,
        name:    true,
        email:   true,
        address: true
      },
    });
  }

  static async storeInventory(data: Inventory): Promise<Inventory> {
    return await db.inventory.create({
      data: {
        customerId: data.id as number,
      },
      select: {
        id: true,
        customerId: true,
      },
    });
  }

  static async storeResources(data: Resource): Promise<Resource> {
    return await db.resource.create({
      data: {
        inventoryId: data.inventoryId as number,
        orderId: data.orderId as number,
        title: data.title as Product,
        amount: data.amount as number,
      },
      select: {
        id: true,
        inventoryId: true,
        orderId: true,
        title: true,
        amount: true,
      },
    });
  };

  static async storeOrder(order: Order): Promise<Order> {
    return await db.order.create({
      data: {
        customerId: order.customerId as number,
        createdAt: order.createdAt as Date,
        deliveredAt: order.deliveredAt as Date || null,
        type: order.type as OrderType,
        status: order.status as OrderStatus,
      },
      select: {
        id: true,
        customerId: true,
        createdAt: true,
        deliveredAt: true,
        type: true,
        status: true,
      },
    });
  };

  // Store order transaction receipt
  static async storeReceiptToDb(data: Receipt): Promise<Receipt | null> {
    return await db.receipt.create({
      data: {
        orderId: data.orderId,
        to: data.to,
        from: data.from,
        blockHash: data.blockHash,
        blockNumber: data.blockNumber,
        status: data.status,
        hash: data.hash,
      },
      select: {
        id: true,
        orderId: true,
        to: true,
        from: true,
        blockHash: true,
        blockNumber: true,
        status: true,
        hash: true,
      },
    });
  };

  static async updateCustomerInclRelation(id: number, data: any): Promise<Customer> {
    return await db.customer.update({
      where: {
        id,
      },
      data: {
        address: data.address,
        order: {
          connect: { id: data.orderId }
        }
      },
    });
  };
  
  static async updateInventory(inventoryId: number, data: any): Promise<Inventory> {
    return await db.inventory.update({
      where: {
        id: inventoryId,
      },
      data
    });
  };

  static async updateInventoryResource(data: any): Promise<Inventory> {
    return await db.inventory.update({
      where: {
        id: data.inventoryId as number,
      },
      data: {
        resources: {
          connect: { id: data.resourceId as number }
        }
      }
    });
  };

  static async updateOrder(orderId: number, data: any): Promise<Order> {
    return await db.order.update({
      where: {
        id: orderId,
      },
      data
    });
  };

  static async updateOrderDeliveryDate(data: any): Promise<Order> {
    return await db.order.update({
      where: {
        id: data.orderId as number,
      },
      data: {
        deliveredAt: data.deliveredAt as Date,
      },
    });
  };

  static async updateOrderIncludingResourceRelation(orderId: number, data: any): Promise<Order> {
    return await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: data.status,
        deliveredAt: data.deliveredAt,
        list: {
          connect: { id: data.resourceId }
        }
      }
    });
  };

  static async updateOrderStatus(data: any): Promise<Order> {
    return await db.order.update({
      where: {
        id: data.orderId as number,
      },
      data: {
        status: data.status as OrderStatus,
      },
    });
  };

  static async updateOrderResourceId(data: any): Promise<Order> {
    return await db.order.update({
      where: {
        id: data.orderId as number,
      },
      data: {
        list: {
          connect: { id: data.resourceId as number }
        }
      },
    });
  };

}

export default OrderService;
