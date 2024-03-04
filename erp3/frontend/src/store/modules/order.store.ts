/* eslint-disable prettier/prettier */
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import Axios from "../../services/api/api.backend.service";
import AxiosBc from "../../services/api/api.blockchain.service";
import {
  Customer,
  Order,
  OrderType,
  Receipt,
  Resource,
} from "../../models/order.model";
// import { Company } from "@/models/company.model";

@Module
export default class OrderStoreModule extends VuexModule {
  private HTTP_RESPONSE = Object.freeze({
    OK: 200,
    NOT_FOUND: 404,
  });

  private customerList: Customer[] = [];

  get CustomerList(): Customer[] {
    return this.customerList;
  }
  @Mutation
  [Mutations.SET_CUSTOMERS](payload: Customer[]) {
    for (const c of payload) {
      this.customerList.push(c);
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.BLOCKCHAIN_INFORM_SELLER](data: any) {
    const buyerInfoUrl = AxiosBc.defaults.baseURL + "/order" + "/emitInformSeller";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const eventPayload = {
      address: this.context.getters.user.address as string,
      seller: data.seller as string,
      sellerEmail: data.sellerEmail as string,
      buyer: data.buyer as string,
      buyerEmail: data.buyerEmail as string,
      amount: data.amount as number,
      productBought: data.productBought as string,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let emitBuyerInfoResponse: any = null;
    try {
      const res = await AxiosBc.post(buyerInfoUrl, eventPayload);
      
      const status = res.status as number;
      if (status === this.HTTP_RESPONSE.OK) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        emitBuyerInfoResponse = {
          status,
          transaction: res.data.transaction,
          receipt: res.data.receipt,
        };
        // return emitBuyerInfoResponse;
        // console.log(emitBuyerInfoResponse);
      }
      return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(
        "Actions.BLOCKCHAIN_INFORM_SELLER - ERROR"
      );
      console.log(error);
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.CALCULATE_RESOURCES_QUANTITY](resources: any[]) {
    let inResources = 0;
    let outResources = 0;

    for (const item of resources) {
      const order = (await this.context.dispatch(
        "getOrderById",
        item.orderId
      )) as Order;

      if (String(order.type as OrderType) === OrderType[0]) {
        inResources += item.amount;
      } else if (String(order.type as OrderType) === OrderType[1]) {
        outResources += item.amount;
      }
    }

    const quantity = {
      inResources,
      outResources,
    };

    return quantity;
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.CREATE_ORDER](data: any) {
    const createOrderUrl = Axios.defaults.baseURL + "/order" + "/createOrder";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const createOrderPayload = {
      customerId: data.customerId as number,
      createdAt: new Date(data.createdAt),
      deliveredAt: (data.deliveredAt as Date) || null,
      type: data.type as string,
      status: "PLACED",
      title: data.title as string,
      amount: data.amount as number,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    try {
      const createdOrderRes = await Axios.post(
        createOrderUrl,
        createOrderPayload
      );
      if (createdOrderRes.data !== null) {
        const createdOrder = createdOrderRes.data.createdOrder;

        const customerId = createdOrder.customerId as number;
        const custPayload = {
          customerId,
        };
        const custRes = await this.context.dispatch(
          "getCustomerById",
          custPayload
        );
        const customer = custRes.customer as Customer;

        const regOrderBcPayload = {
          customer,
          order: createdOrder,
        };
        return regOrderBcPayload;
      } else return null; 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Actions.CREATE_ORDER: Store Order section - ERROR");
      console.log(error.response.data.message);
      return error.response.status;
    }
  }
  @Action
  async [Actions.GET_CUSTOMER_BY_ID](id: number) {
    const customerUrl = Axios.defaults.baseURL + "/order" + "/customerById";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    try {
      const res = await Axios.post(customerUrl, id);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Actions.GET_CUSTOMER_BY_ID - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_CUSTOMER_BY_EMAIL](email: string) {
    const customerUrl = Axios.defaults.baseURL + "/order" + "/customerByEmail";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      email,
    };
    try {
      // const res = await Axios.post(customerUrl, email);
      // return res.data;
      const res = await Axios.post(customerUrl, payload);
      return res.data.customer;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Actions.GET_CUSTOMER_BY_EMAIL - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_CUSTOMERS]() {
    const url = Axios.defaults.baseURL + "/order" + "/customers";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.get["Content-Type"] = "application/json";
      Axios.defaults.headers.get.Authorization = "Bearer " + token;
    }

    let list = [] as Customer[];
    try {
      const res = await Axios.get(url);
      res !== null ? (list = res.data.customerList) : (list = []);

      if (list.length > 0) {
        await this.context.commit(Mutations.SET_CUSTOMERS, list);
      }

      return list;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_CUSTOMERS - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_CUSTOMERS_FROM_BC]() {
    const url = AxiosBc.defaults.baseURL + "/order" + "/customers";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    let list = [] as Customer[];
    const payload = {
      address: this.context.getters.user.address as string,
      company: this.context.getters.getCompanyName as string,
    };

    try {
      const res = await AxiosBc.post(url, payload);
      res.data !== null ? (list = res.data.customers) : (list = []);

      return list;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Actions.GET_CUSTOMERS_FROM_BC - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_ORDER_BY_ORDER_ID_FROM_BC](id: number) {
    const url = AxiosBc.defaults.baseURL + "/order" + "/orderById";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      address: this.context.getters.user.address as string,
      company: this.context.getters.getCompanyName as string,
      orderId: id as number,
    };

    try {
      const res = await AxiosBc.post(url, payload);

      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        const order = res.data.order;
        return order;
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDER_BY_ORDER_ID_FROM_BC - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_ORDER_BY_ORDER_ID](id: number) {
    const url = Axios.defaults.baseURL + "/order" + "/order";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      orderId: id,
    };

    try {
      const res = await Axios.post(url, payload);

      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        const order = res.data.order;
        return order;
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDER_BY_ORDER_ID - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_ORDER_RECEIPT_BY_ORDER_ID](id: number) {
    const getReceiptUrl =
      Axios.defaults.baseURL + "/order" + "/orderReceiptByOrderId";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      orderId: id,
    };

    try {
      const res = await Axios.post(getReceiptUrl, payload);
      return res.data.receipt;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDER_RECEIPT_BY_ORDER_ID - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_ORDERS_BY_CUSTOMER_EMAIL](email: string) {
    const url = Axios.defaults.baseURL + "/order" + "/orders";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      email,
    };

    try {
      const res = await Axios.post(url, payload);
      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        const customer = res.data.customer;
        const orders = res.data.orders;
        return { customer, orders };
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDERS_BY_CUSTOMER_EMAIL - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_ORDERS_BY_CUSTOMER_EMAIL_FROM_BC](email: string) {
    const url = AxiosBc.defaults.baseURL + "/order" + "/ordersByCustomerEmail";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      address: this.context.getters.user.address as string,
      company: this.context.getters.getCompanyName as string,
      email: email as string,
    };

    try {
      const res = await AxiosBc.post(url, payload);
      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        const orders = res.data.orders;
        return orders;
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDERS_BY_CUSTOMER_ID_FROM_BC - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_ORDERS_BY_CUSTOMER_ID](id: number) {
    const url = Axios.defaults.baseURL + "/order" + "/ordersByCustomerId";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      customerId: id as number,
    };

    try {
      const res = await Axios.post(url, payload);
      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        const customer = res.data.customer;
        const orders = res.data.orders;
        return { customer, orders };
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDERS_BY_CUSTOMER_ID - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_ORDERS_BY_CUSTOMER_ID_FROM_BC](id: number) {
    const url = AxiosBc.defaults.baseURL + "/order" + "/ordersByCustomerId";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      address: this.context.getters.user.address as string,
      company: this.context.getters.getCompanyName as string,
      customerId: id as number,
    };

    try {
      const res = await AxiosBc.post(url, payload);
      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        const orders = res.data.orders;
        return orders;
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDERS_BY_CUSTOMER_ID_FROM_BC - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_RESOURCES_BY_CUSTOMER_ID](id: number) {
    const url = Axios.defaults.baseURL + "/order" + "/resourcesByCustomerId";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      customerId: id,
    };

    try {
      const res = await Axios.post(url, payload);
      const resources = res.data.resources as Resource[];
      const quantity = await this.context.dispatch(
        "calculateResourcesQuantity",
        resources
      );

      return quantity;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_RESOURCES_BY_CUSTOMER_ID - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.GET_RESOURCES_BY_ORDER_ID](id: number) {
    const url = Axios.defaults.baseURL + "/order" + "/resourceByOrderId";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      orderId: id as number,
    };

    try {
      const res = await Axios.post(url, payload);
      return res.data.resource;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_RESOURCES_BY_ORDER_ID - ERROR");
      console.log(error);
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.REGISTER_CUSTOMER_TO_BC](data: any) {
    const customer = JSON.parse(JSON.stringify(data));
    const company = this.context.getters.getCompanyName;
    customer.company = company;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { incoming: _, outgoing: __, ...payload } = customer;
    const regCustUrl =
      AxiosBc.defaults.baseURL + "/order" + "/registerCustomer";

    try {
      const res = await AxiosBc.post(regCustUrl, payload);

      const status = res.status as number;
      if (status === this.HTTP_RESPONSE.OK) {
        const response = {
          status,
          transaction: res.data.transaction,
          receipt: res.data.receipt,
        };
        return response;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // const status = error.response.status;
      // console.log("Store.enrollCustomerToBc - ERROR: " + status);
      return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.REGISTER_ORDER_TO_BC](data: any) {
    const customer = data.customer;
    const order = data.order;
    const orderId = order.id as number;

    const resource = await this.context.dispatch(
      "getResourcesByOrderId",
      orderId
    );

    if (resource !== null) {
      const product = resource.title as string;
      const resourcePayload = {
        address: customer.address as string,
        resourceId: resource.id as number,
        product: product,
        amount: resource.amount as number,
        company: this.context.getters.getCompanyName,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resourceResult: any = null;
      try {
        resourceResult = await this.context.dispatch(
          "enrollResourceToBc",
          resourcePayload
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const status = error.response.status;
        console.log(
          "Store.enrollOrderToBc.enrollResourceToBc - ERROR: " + status
        );
        const res = error.response;
        console.log(res);
      }

      if (resourceResult.status !== 403) {
        let deliveredAt = 0;
        order.deliveredAt === null
          ? deliveredAt
          : (deliveredAt = new Date(order.deliveredAt).valueOf() as number);
        const orderPayload = {
          address: customer.address as string,
          orderId: order.id as number,
          customerId: customer.id as number,
          resourceId: resource.id as number,
          createdAt: Date.parse(order.createdAt) as number,
          deliveredAt,
          orderType: order.type,
          orderStatus: order.status,
          company: this.context.getters.getCompanyName,
        };

        try {
          const regOrderUrl =
            AxiosBc.defaults.baseURL + "/order" + "/registerOrder";
          const res = await AxiosBc.post(regOrderUrl, orderPayload);
          const status = res.status as number;
          if (status === this.HTTP_RESPONSE.OK) {
            const response = {
              status,
              transaction: res.data.transaction,
              receipt: res.data.receipt,
            };
            return response;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const status = error.response.status;
          console.log("Store.enrollOrderToBc - ERROR: " + status);
          // const res = error.response;
          // console.log(res);
          return null;
        }
      } else {
        const receipt = await this.context.dispatch(
          "getOrderReceiptByOrderId",
          orderId
        );
        const response = {
          receipt,
        };
        return response;
      }
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.REGISTER_RESOURCE_TO_BC](data: any) {
    const regResUrl = AxiosBc.defaults.baseURL + "/order" + "/registerResource";

    try {
      const res = await AxiosBc.post(regResUrl, data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any = null;
      if (res.status === this.HTTP_RESPONSE.OK) {
        if (res.data.receipt === null) {
          response = {
            status: res.data.statusCode,
            transaction: null,
            receipt: null,
          };
        } else {
          response = {
            status: res.data.statusCode,
            transaction: res.data.transaction,
            receipt: res.data.receipt,
          };
        }
      }
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // const status = error.response.status;
      // console.log("Store.enrollResourceToBc - ERROR: " + status);
      // const res = error.response;
      // console.log(res);
      return null;
    }
  }
  @Action
  async [Actions.RETRIEVE_ALL]() {
    const url = AxiosBc.defaults.baseURL + "/order" + "/retrieveAll";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      address: this.context.getters.user.address as string,
      company: this.context.getters.getCompanyName as string,
    };

    try {
      const res = await AxiosBc.post(url, payload);
      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        return res.data;
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("RETRIEVE_ALL - ERROR");
      console.log(error);
    }
  }
  @Action
  async [Actions.STORE_CUSTOMER_TO_DB](payload: Customer) {
    const storeUrl = Axios.defaults.baseURL + "/order" + "/createCustomer";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    try {
      const res = await Axios.post(storeUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.message);
      console.log("Perhaps receipt is already stored in DB");
      return error.response.status;
    }
  }
  @Action
  async [Actions.STORE_ORDER_RECEIPT](payload: Receipt) {
    const storeReceiptUrl = Axios.defaults.baseURL + "/order" + "/storeReceipt";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    try {
      const res = await Axios.post(storeReceiptUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.message);
      console.log("Perhaps receipt is already stored in DB");
      return error.response.status;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.UPDATE_ORDER_ON_DB](payload: any) {
    const updateUrl = Axios.defaults.baseURL + "/order" + "/update";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.patch["Content-Type"] = "application/json";
      Axios.defaults.headers.patch.Authorization = "Bearer " + token;
    }

    try {
      const res = await Axios.patch(updateUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.message);
      console.log("Actions.UPDATE_ORDER_ON_DB - ERROR");
      return error.response.status;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.UPDATE_ORDER_DELIVERY_DATE_ON_BC](payload: any) {
    const updateDelDateUrl =
      AxiosBc.defaults.baseURL + "/order" + "/updateDeliveryDate";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.patch["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.patch.Authorization = "Bearer " + token;
    }

    try {
      const res = await AxiosBc.patch(updateDelDateUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.message);
      console.log("Actions.UPDATE_ORDER_DELIVERY_DATE_ON_BC - ERROR");
      return error.response.status;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.UPDATE_ORDER_DELIVERY_DATE_ON_DB](payload: any) {
    const updateDelDateUrl =
      Axios.defaults.baseURL + "/order" + "/updateDeliveryDate";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      Axios.defaults.headers.patch["Content-Type"] = "application/json";
      Axios.defaults.headers.patch.Authorization = "Bearer " + token;
    }

    try {
      const res = await Axios.patch(updateDelDateUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.message);
      console.log("Actions.UPDATE_ORDER_DELIVERY_DATE_ON_DB - ERROR");
      return error.response.status;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.UPDATE_ORDER_STATUS_ON_BC](payload: any) {
    const orderStatusUrl =
      AxiosBc.defaults.baseURL + "/order" + "/updateOrderStatus";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.patch["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.patch.Authorization = "Bearer " + token;
    }

    try {
      const res = await AxiosBc.patch(orderStatusUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.message);
      console.log("Actions.UPDATE_ORDER_STATUS_ON_BC - ERROR");
      return error.response.status;
    }
  }
}
