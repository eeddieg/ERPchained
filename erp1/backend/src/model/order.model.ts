import type { OrderStatus, OrderType, Product } from "@prisma/client";

export type Order = {
  id?:         number,
  customerId?: number,
  list?:       Resource[],
  createdAt:   Date  | null,
  deliveredAt: Date  | null,
  type:        OrderType,
  status:      OrderStatus,
}

export type Customer = {
  id?:        number,
  name?:      string | null,
  email:      string | null,
  address:    string | null,
  inventory?: Inventory,
  orders?:    Order[],
}

export type Inventory = {
  id?:        number,
  customerId: number,
  resources?: Resource[],
}

export type Resource = {
  id?:         number,
  inventoryId: number,
  orderId:     number,
  title:       Product,
  amount:      number,
}

export type Receipt = {
  id?:          number;
  orderId:      number;
  to:           string;
  from:         string;
  blockHash:    string;
  blockNumber:  number;
  status:       number;
  hash:         string;
}