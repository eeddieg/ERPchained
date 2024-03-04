import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import AxiosBc from "../../services/api/api.blockchain.service";
import HTTP_RESPONSE from "../enums/http.response";

@Module
export default class ContractStoreModule extends VuexModule {
  private maxBlockNumber = 0;

  get currentBlockNumber(): number {
    return this.maxBlockNumber;
  }

  @Mutation
  [Mutations.SET_MAX_BLOCK_NUMBER](value: number) {
    this.maxBlockNumber = value;
  }

  @Action
  async [Actions.GET_MAX_BLOCK_NUMBER]() {
    const url = AxiosBc.defaults.baseURL + "/server" + "/maxBlockNumber";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.get["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.get.Authorization = "Bearer " + token;
    }

    try {
      const res = await AxiosBc.get(url);
      if (res.data.statusCode === HTTP_RESPONSE.OK) {
        const blockNumber = res.data.blockNumber;
        return blockNumber;
      } else if (res.data.statusCode === HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_MAX_BLOCK_NUMBER - ERROR");
      console.log(error);
    }
  }
}
