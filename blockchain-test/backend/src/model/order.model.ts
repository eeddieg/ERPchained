export enum OrderStatus {
  PLACED = "PLACED",
  PROCESS = "PROCESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum OrderType {
  INCOMING = "INCOMING",
  OUTCOMING = "OUTCOMING",
}

export enum Product { 
  WHEAT = "wheat", 
  FLOUR = "flour", 
  BREAD = "bread" 
}

export interface Order {
  id: number;
  createdAt: Date;
  customerId: number;
  deliveredAt: Date;
  list: Resource;
  status: OrderStatus;
  type: OrderType;
}

export interface OrderBc {
  customerId: string;
  createdAt: number;
  deliveredAt: number;
  orderId: string;
  resource: Resource,
  resourceId: number;
  status: string;
  type: string;
}

export interface Resource {
  amount: number;
  id: number;
  inventoryId: number;
  orderId: number;
  title: Product;
}

export interface ResourceBc {
  amount: number;
  id: number;
  title: string;
}
export interface CustomerBc {
  company: string;
  email: string;
  id: number;
  name: string;
}