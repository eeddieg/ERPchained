import { User, UserRole } from "../../models/user.model";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import ApiService from "../../services/api/api.service";

@Module
export default class AuthStoreModule extends VuexModule {
  // user: User = {
  //   id: -1,
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   password: "",
  //   role: UserRole.USER,
  //   refreshToken: "",
  //   mfaId: -1,
  // };
  // authenticated = false;
  //
  // get isAuthenticated() {
  //     return this.authenticated;
  //   };
  //
  // get currentUser() {
  //     return this.user;
  //   };
  //
  // @Mutation
  // [Mutations.setAuthenticatedStatus](payload: boolean) {
  //   this.authenticated = payload;
  // };
  // [Mutations.setRefreshTokenToken](payload: string) {
  //   this.user.refreshToken = payload;
  // };
  // [Mutations.setPassword](payload: string) {
  //     this.user.password = payload;
  // };
  // [Mutations.setUser](payload: User) {
  //     this.user = payload;
  // };
  //
  //
  // @Action
  // async [Actions.login](payload: any) {
  //   return new Promise<void>((resolve, reject) => {
  //     const urlLogin = Axios.defaults.baseURL + "/user" + "/login";
  //     if (payload.email.length > 0 && payload.password.length > 0) {
  //       try {
  //         const res = await Axios.post(urlLogin, payload);
  //
  //         if (res.status === 200) {
  //           const user: User = res.data.data;
  //           user.refreshToken = "";
  //           this.content.commit("setUser", user);
  //           content.dispatch(
  //             "storeToBrowserLocalStorage",
  //             res.data.accessToken
  //           );
  //           content.commit("setPassword", "");
  //           content.commit("setAuthenticatedStatus", true);
  //           return res.status;
  //         }
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       } catch (error: any) {
  //         console.log(error.response.data.message);
  //         return error.response.status;
  //       }
  //     }
  //
  //   });
  // };
}
