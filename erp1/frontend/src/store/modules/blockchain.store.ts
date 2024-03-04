import { Action, Module, VuexModule } from "vuex-module-decorators";
import { Actions } from "../enums/storeEnums";
import AxiosBc from "../../services/api/api.blockchain.service";

@Module
export default class BlockChainStoreModule extends VuexModule {
  private HTTP_RESPONSE = Object.freeze({
    OK: 200,
    NOT_FOUND: 404,
  });

  @Action
  async [Actions.GET_ORDER_BY_TRANSACTION_HASH_FROM_BC](hash: string) {
    const url =
      AxiosBc.defaults.baseURL + "/server" + "/blockInfoByTransactionHash";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      hash: hash as string,
    };

    try {
      const res = await AxiosBc.post(url, payload);

      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        return res.data.info;
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("GET_ORDER_BY_TRANSACTION_HASH_FROM_BC - ERROR");
      console.log(error);
    }
  }

  @Action
  async [Actions.DESERIALIZE_ORDER_TRANSACTION](hash: string) {
    const url = AxiosBc.defaults.baseURL + "/server" + "/deserialize";
    const token = localStorage.getItem("token") || null;
    if (token != null && token !== "") {
      AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
      AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
    }

    const payload = {
      tx: hash as string,
    };

    try {
      const res = await AxiosBc.post(url, payload);

      if (res.data.statusCode === this.HTTP_RESPONSE.OK) {
        return res.data.order;
      } else if (res.data.statusCode === this.HTTP_RESPONSE.NOT_FOUND) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("DESERIALIZE_ORDER_TRANSACTION - ERROR");
      console.log(error);
    }
  }
}
