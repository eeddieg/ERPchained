import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import AxiosBc from "../../services/api/api.blockchain.service";
import { Company } from "../../models/company.model";
import {
  Customer,
  OrderStatusBc,
  OrderTypeBc,
  ProductBc,
} from "@/models/order.model";
import HTTP_RESPONSE from "../enums/http.response";
import Axios from "@/services/api/api.backend.service";

@Module
export default class CompanyStoreModule extends VuexModule {
  private company = {
    name: "Company_B",
    email: "compB@test.com",
    phone: "(239) 815-8918",
    mobile: "(239) 815-1898",
    address: "Bay Area, San Francisco, CA",
    reservedResources: 0,
    availableResources: 0,
    productToBuy: ProductBc.FLOUR,
    productToSell: ProductBc.BREAD,
  } as Company;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get getCompany(): Company {
    return this.company;
  }
  get getCompanyName(): string {
    return this.company.name;
  }
  get getReservedResources(): number {
    return this.company.reservedResources;
  }
  get getAvailableResources(): number {
    return this.company.availableResources;
  }
  get getProductToBuy(): string {
    return this.company.productToBuy;
  }
  get getProductToSell(): string {
    return this.company.productToSell;
  }

  @Mutation
  [Mutations.SET_COMPANY_DETAILS](payload: Company) {
    this.company = payload;
  }
  @Mutation
  [Mutations.SET_COMPANY_BRAND](value: string) {
    this.company.name = value;
  }
  @Mutation
  [Mutations.SET_INBOUND](value: number) {
    this.company.reservedResources = value;
  }
  @Mutation
  [Mutations.SET_OUTBOUND](value: number) {
    this.company.availableResources = value;
  }
  @Mutation
  [Mutations.SET_PRODUCT_TO_BUY](value: ProductBc) {
    this.company.productToBuy = value;
  }
  @Mutation
  [Mutations.SET_PRODUCT_TO_SELL](value: ProductBc) {
    this.company.productToSell = value;
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.CHECK_COMPANY_REGISTRATION_STATUS](payload: any) {
    const checkCompRegStatusUrl =
      AxiosBc.defaults.baseURL + "/company" + "/regStatus";

    try {
      const res = await AxiosBc.post(checkCompRegStatusUrl, payload);
      if (res.status === HTTP_RESPONSE.OK) {
        return res.data.regStatus;
      } else {
        console.log("ERROR: CHECK_COMPANY_REGISTRATION_STATUS");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Actions.CHECK_COMPANY_REGISTRATION_STATUS - ERROR");
      console.log(error);
      return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.GET_BUYERS_LIST_FROM_BC](product: string) {
    const companyListUrl = AxiosBc.defaults.baseURL + "/company" + "/buyList";

    const payload = {
      address: this.context.getters.user.address as string,
      product: product as string,
    };

    try {
      const res = await AxiosBc.post(companyListUrl, payload);
      return res.data.list as Company[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.GET_BUYERS_LIST_FROM_BC - ERROR: " + status);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.GET_COMPANY_FROM_BC_BY_COMPANY_ID]() {
    const companyInfoUrl = AxiosBc.defaults.baseURL + "/company" + "/info";

    const payload = {
      address: this.context.getters.user.address as string,
      companyName: this.context.getters.getCompanyName as string,
    };

    try {
      const res = await AxiosBc.post(companyInfoUrl, payload);
      return res.data.company as Company;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.UPDATE_COMPANY_RESOURCES - ERROR: " + status);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.GET_COMPANY_RESOURCES_FROM_BC]() {
    const getResourcesUrl =
      AxiosBc.defaults.baseURL + "/company" + "/updatedData";

    try {
      const payload = {
        companyName: this.context.getters.getCompanyName,
      };

      const res = await AxiosBc.post(getResourcesUrl, payload);
      const comp = this.context.getters.getCompany as Company;
      const company = {
        name: res.data.company.name,
        email: comp.email,
        phone: comp.phone,
        mobile: comp.mobile,
        address: comp.address,
        reservedResources: res.data.company.reservedResources,
        availableResources: res.data.company.availableResources,
        productToBuy: this.context.getters.getProductToBuy,
        productToSell: this.context.getters.getProductToSell,
      } as Company;

      this.context.commit("setCompanyDetails", company);

      return company;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.GET_COMPANY_RESOURCES_FROM_BC - ERROR: " + status);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.GET_INCOMING_ORDER_FROM_BC]() {
    const receiveOrderUrl =
      AxiosBc.defaults.baseURL + "/order" + "/registerIncomingOrder";

    try {
      const payload = {
        seller: this.context.getters.getCompanyName,
      };

      const res = await AxiosBc.post(receiveOrderUrl, payload);

      console.log("Actions.GET_INCOMING_ORDER_FROM_BC");

      if (res.data.order !== null) {
        const order = res.data.order;
        const email = order.buyerEmail as string;

        // search in DB
        let resCustomer = null;
        try {
          resCustomer = await this.context.dispatch(
            "getCustomerByEmail",
            email
          );

          let customer: Customer | null = null;
          customer = resCustomer as Customer;

          if (customer === null) {
            const custCreateUrl =
              Axios.defaults.baseURL +
              "/order" +
              "/createCustomerFromIncomingOrder";

            const token = localStorage.getItem("token") || null;
            if (token != null && token !== "") {
              Axios.defaults.headers.post["Content-Type"] = "application/json";
              Axios.defaults.headers.post.Authorization = "Bearer " + token;
            }

            const custPayload = {
              address: order.buyerAddress as string,
              name: order.buyer as string,
              email: order.buyerEmail as string,
              amount: order.amount as number,
              product: order.productBought as string,
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await Axios.post(custCreateUrl, custPayload);
            customer = res.data.customer as Customer;
          }

          // Update customer's order list - create new order from incoming
          const orderPayload = {
            customerId: customer.id as number,
            createdAt: new Date() as Date,
            deliveredAt: null,
            type: OrderTypeBc.OUTCOMING as OrderTypeBc,
            status: OrderStatusBc.PLACED as OrderStatusBc,
            title: order.productBought as string,
            amount: order.amount as number,
          };
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const createdOrder = await this.context.dispatch(
            "createOrder",
            orderPayload
          );
          // CHECK CORRECT RESOURCES
          // update resources
          const temp = [];
          const list = await this.context.dispatch("getCustomers");

          for (const cust of list) {
            const customerId = cust.id as number;
            const resources = await this.context.dispatch(
              "getResourcesByCustomerId",
              customerId
            );

            cust.incoming = resources.inResources;
            cust.outgoing = resources.outResources;
            temp.push(cust);
          }

          let availableResources = 0;
          let reservedResources = 0;
          for (const cust of temp) {
            availableResources += cust.incoming;
            reservedResources += cust.outgoing;
          }

          const companyResources = {
            availableResources,
            reservedResources,
          };

          companyResources.availableResources -= order.amount;
          companyResources.reservedResources += order.amount;

          const resPayload = {
            outbound: companyResources.reservedResources as number,
            inbound: companyResources.availableResources as number,
          };

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const updatedResources = await this.context.dispatch(
            "setCompanyResourcesOnBc",
            resPayload
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log("Actions.GET_INCOMING_ORDER_FROM_BC - DB error");
          console.log(error);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.GET_INCOMING_ORDER_FROM_BC - ERROR: " + status);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.GET_SELLERS_LIST_FROM_BC](product: string) {
    const companyListUrl = AxiosBc.defaults.baseURL + "/company" + "/sellList";

    const payload = {
      address: this.context.getters.user.address as string,
      product: product as string,
    };

    try {
      const res = await AxiosBc.post(companyListUrl, payload);
      return res.data.list as Company[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.GET_SELLERS_LIST_FROM_BC - ERROR: " + status);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.REGISTER_COMPANY_TO_BC](data: any) {
    const regCompUrl =
      AxiosBc.defaults.baseURL + "/company" + "/registerCompany";

    const payload = {
      address: this.context.getters.user.address as string,
      companyName: this.context.getters.getCompanyName as string,
      email: this.context.getters.getCompany.email as string,
      reservedResources: data.reservedResources as number,
      availableResources: data.availableResources as number,
      productToBuy: data.productToBuy as string,
      productToSell: data.productToSell as string,
    };
    try {
      const regPayload = {
        address: payload.address,
        companyName: payload.companyName,
      };
      const status = await this.context.dispatch(
        "checkCompanyRegStatus",
        regPayload
      );
      if (!status) {
        console.log("Registering Company on blockchain...");
        const res = await AxiosBc.post(regCompUrl, payload);
        if (res.status === HTTP_RESPONSE.OK) {
          console.log("Register: Success");
        }
      } else {
        // console.log("Company is already registered on blockchain");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Store.enrollCustomerToBc - ERROR: " + status);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.SET_COMPANY_RESOURCES_ON_BC](data: any) {
    const setResourcesUrl =
      AxiosBc.defaults.baseURL + "/company" + "/setResources";

    try {
      const payload = {
        address: this.context.getters.user.address as string,
        companyName: this.context.getters.getCompanyName as string,
        reservedResources: data.outbound as number,
        availableResources: data.inbound as number,
      };

      const res = await AxiosBc.patch(setResourcesUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.SET_COMPANY_RESOURCES - ERROR: " + status);
      console.log(error);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.UPDATE_COMPANY_INFO_ON_BC](data: any) {
    const updateCompanyUrl =
      AxiosBc.defaults.baseURL + "/company" + "/updateCompany";

    const payload = {
      address: this.context.getters.user.address as string,
      companyName: data.name as string,
      email: data.email as string,
      phone: data.phone as string,
      mobile: data.mobile as string,
      reservedResources: data.reservedResources as number,
      availableResources: data.availableResources as number,
      productToBuy: data.productToBuy as string,
      productToSell: data.productToSell as string,
    };

    try {
      const res = await AxiosBc.patch(updateCompanyUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.UPDATE_COMPANY_INFO_ON_BC - ERROR: " + status);
      // return null;
    }
  }
  @Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async [Actions.UPDATE_COMPANY_RESOURCES](data: any) {
    const updateResourcesUrl =
      AxiosBc.defaults.baseURL + "/company" + "/updateResources";

    const payload = {
      address: this.context.getters.user.address as string,
      companyName: this.context.getters.getCompanyName as string,
      reservedResources: data.outbound as number,
      availableResources: data.inbound as number,
    };

    try {
      const res = await AxiosBc.patch(updateResourcesUrl, payload);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response.status;
      console.log("Actions.UPDATE_COMPANY_RESOURCES - ERROR: " + status);
      // return null;
    }
  }
}
