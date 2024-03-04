import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import {
  Customer,
  Order,
  OrderType,
  OrderTypeBc,
} from "../../models/order.model";

@Module
export default class StatisticsStoreModule extends VuexModule {
  private bcGridVisible = false;
  private dbGridVisible = true;
  private gridVisible = true;

  get isBcVisible(): boolean {
    return this.bcGridVisible;
  }

  get isDbVisible(): boolean {
    return this.dbGridVisible;
  }

  get isGridVisible(): boolean {
    return this.gridVisible;
  }

  @Mutation
  [Mutations.SET_STATS_BC_VISIBILITY](payload: boolean) {
    this.bcGridVisible = payload;
  }

  @Mutation
  [Mutations.SET_STATS_DB_VISIBILITY](payload: boolean) {
    this.dbGridVisible = payload;
  }

  @Mutation
  [Mutations.SET_STATS_VISIBILITY](payload: boolean) {
    this.gridVisible = payload;
  }

  @Action
  async [Actions.CALCULATE_NUMBER_OF_CUSTOMERS](): Promise<number> {
    let customersNumber: number;

    const customers = await this.context.dispatch("getCustomers");
    customers.length > 0
      ? (customersNumber = customers.length)
      : (customersNumber = 0);
    return customersNumber;
  }

  @Action
  async [Actions.CALCULATE_NUMBER_OF_CUSTOMERS_ON_BC](): Promise<number> {
    let customersNumber: number;

    const customers = await this.context.dispatch("getCustomersFromBc");
    customers.length > 0
      ? (customersNumber = customers.length)
      : (customersNumber = 0);
    return customersNumber;
  }

  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.CALCULATE_NUMBER_OF_ORDERS_PER_CUSTOMER](): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: { [key: string]: any } = {};

    const customers = (await this.context.dispatch(
      "getCustomers"
    )) as Customer[];

    if (customers.length > 0) {
      for (const index in customers) {
        const customer = customers[index] as Customer;
        const res = await this.context.dispatch(
          "getOrdersByCustomerId",
          customer.id
        );

        const cust = res.customer as Customer;
        const orders = res.orders as Order[];

        const customerName = cust.name as string;
        const numOfOrders = orders.length as number;
        data[customerName] = numOfOrders;
      }
    }
    return data;
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.CALCULATE_NUMBER_OF_ORDERS_PER_CUSTOMER_FROM_BC](): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: { [key: string]: any } = {};

    let customers = [] as Customer[];
    try {
      customers = (await this.context.dispatch(
        "getCustomersFromBc"
      )) as Customer[];
    } catch (error) {
      console.log("Actions.CALCULATE_NUMBER_OF_ORDERS_PER_CUSTOMER_FROM_BC");
      console.log(error);
    }

    if (customers !== undefined) {
      if (customers.length > 0) {
        for (const index in customers) {
          const customer = customers[index] as Customer;
          const orders = await this.context.dispatch(
            "getOrdersByCustomerIdFromBc",
            customer.id
          );

          if (orders !== null) {
            const customerName = customer.name as string;
            const numOfOrders = orders.length as number;
            data[customerName] = numOfOrders;
          }
        }
      }
    }
    return data;
  }

  @Action
  async [Actions.CHECK_BC_INFO_STATUS]() {
    //
  }

  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.GET_SPLITTED_RESOURCES_PER_CUSTOMER](): Promise<any> {
    const customers = (await this.context.dispatch(
      "getCustomers"
    )) as Customer[];

    const customersName = [] as string[];
    const incomingResourses = [] as number[];
    const outgoingResourses = [] as number[];

    if (customers.length > 0) {
      for (const index in customers) {
        const customer = customers[index] as Customer;

        const res = await this.context.dispatch(
          "getOrdersByCustomerId",
          customer.id
        );

        const cust = res.customer as Customer;
        const orders = res.orders as Order[];

        const customerName = cust.name as string;
        let incomingResources = 0;
        let outgoingResources = 0;

        for (const order of orders) {
          const resources = await this.context.dispatch(
            "getResourcesByOrderId",
            order.id
          );

          const type = (order.type as OrderType).toString();
          if (type === OrderTypeBc.INCOMING) {
            incomingResources += resources.amount;
          } else if (type === OrderTypeBc.OUTCOMING) {
            outgoingResources += resources.amount;
          }
        }
        customersName.push(customerName);
        incomingResourses.push(incomingResources);
        outgoingResourses.push(outgoingResources);
      }
      return { customersName, incomingResourses, outgoingResourses };
    }
  }

  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.GET_SPLITTED_RESOURCES_PER_CUSTOMER_FROM_BC](): Promise<any> {
    let customers = [] as Customer[];

    try {
      customers = (await this.context.dispatch(
        "getCustomersFromBc"
      )) as Customer[];
    } catch (error) {
      console.log("Actions.GET_SPLITTED_RESOURCES_PER_CUSTOMER_FROM_BC");
      console.log(error);
    }

    const customersName = [] as string[];
    const incomingResourses = [] as number[];
    const outgoingResourses = [] as number[];

    if (customers !== undefined) {
      if (customers.length > 0) {
        for (const index in customers) {
          const customer = customers[index] as Customer;

          const orders = await this.context.dispatch(
            "getOrdersByCustomerIdFromBc",
            customer.id
          );

          const customerName = customer.name as string;
          let incomingResources = 0;
          let outgoingResources = 0;

          for (const indexB in orders) {
            const order = orders[indexB];

            const type = (order.type as OrderType).toString();
            if (type === OrderTypeBc.INCOMING) {
              incomingResources += order.amount;
            } else if (type === OrderTypeBc.OUTCOMING) {
              outgoingResources += order.amount;
            }
          }
          customersName.push(customerName);
          incomingResourses.push(incomingResources);
          outgoingResourses.push(outgoingResources);
        }
        return { customersName, incomingResourses, outgoingResourses };
      }
    }
  }
}
