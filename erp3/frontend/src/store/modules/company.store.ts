import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import AxiosBc from "../../services/api/api.blockchain.service";
import { Company } from "../../models/company.model";
import { ProductBc } from "@/models/order.model";
import HTTP_RESPONSE from "../enums/http.response";

@Module
export default class CompanyStoreModule extends VuexModule {
  private company = {
    name: "Company_C",
    email: "compC@test.com",
    phone: "(239) 816-2192",
    mobile: "(239) 816-2254",
    address: "Bay Area, San Francisco, CA",
    reservedResources: 0,
    availableResources: 0,
    productToBuy: ProductBc.BREAD,
    productToSell: ProductBc.PACKED_BREAD,
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
