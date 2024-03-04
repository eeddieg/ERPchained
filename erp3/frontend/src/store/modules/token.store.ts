import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import Axios from "../../services/api/api.backend.service";

@Module
export default class TokenStoreModule extends VuexModule {
  private statusCode = 0;

  get StatusCode() {
    return this.statusCode;
  }

  @Mutation
  [Mutations.SET_STATUS_CODE](payload: number) {
    this.statusCode = payload;
  }

  @Action
  async [Actions.VALIDATE_JWT_TOKEN]() {
    const url = Axios.defaults.baseURL + "/token" + "/verify";
    const token = localStorage.getItem("token") || null;
    if (token === null) {
      return 401;
    } else if (token != null && token !== "") {
      Axios.defaults.headers.post["Content-Type"] = "application/json";
      Axios.defaults.headers.post.Authorization = "Bearer " + token;
    }

    try {
      const res = await Axios.post(url);
      const code = res.data.statusCode;
      this.context.commit("setStatusCode", code);
      return code;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("VALIDATE_JWT_TOKEN - ERROR");
      return error.response.data;
    }
  }
}
