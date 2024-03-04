import { AxiosRequestConfig } from "axios";
import { MFA } from "../../models/mfa.model";
import { User, UserRole } from "../../models/user.model";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "../enums/storeEnums";
import ApiService from "../../services/api/api.service";
import Axios from "../../services/api/api.backend.service";

import router from "../../router";

@Module
export default class UserStoreModule extends VuexModule {
  private authenticated = false;
  private bcAuth = false;
  private companyName = "Company_A";
  private userList = [] as object[];
  private totalUsers = 0;

  private user: User = {
    id: -1,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: UserRole.USER,
    refreshToken: "",
    mfaId: -1,
    address: "",
  };
  private mfa: MFA = {
    id: -1,
    userId: -1,
    status: false,
    verified: false,
    ascii: "",
    hex: "",
    base32: "",
    otpAuthUrl: "",
    qr: "",
  };
  get isAuthenticated() {
    return this.authenticated;
  }

  get isAuthOnBc() {
    return this.bcAuth;
  }

  get currentUser() {
    return this.user;
  }

  get getCompanyName() {
    return this.companyName;
  }

  get usersCounter() {
    return this.totalUsers;
  }

  get refreshToken() {
    return this.user.refreshToken;
  }

  get getUserList() {
    return this.userList;
  }

  get getMfa() {
    return this.mfa;
  }

  @Mutation
  [Mutations.CLEAR_USER_LIST]() {
    this.userList.splice(0, this.userList.length);
  }
  @Mutation
  [Mutations.SET_AUTH_STATUS](payload: boolean) {
    this.authenticated = payload;
  }
  @Mutation
  [Mutations.SET_BC_AUTH_STATUS](payload: boolean) {
    this.bcAuth = payload;
  }
  @Mutation
  [Mutations.SET_REFRESH_TOKEN](payload: string) {
    this.user.refreshToken = payload;
  }
  @Mutation
  [Mutations.SET_PASSWORD](payload: string) {
    this.user.password = payload;
  }
  @Mutation
  [Mutations.SET_USER](payload: User) {
    this.user = payload;
  }
  @Mutation
  [Mutations.SET_TOTAL_USERS](payload: number) {
    this.totalUsers = payload;
  }
  @Mutation
  [Mutations.SET_USER_LIST](payload: object[]) {
    this.userList = payload;
  }
  @Mutation
  [Mutations.SET_MFA](payload: MFA) {
    this.mfa = payload;
  }

  @Action
  async [Actions.LOGIN](payload: { email: string; password: string }) {
    const urlLogin = Axios.defaults.baseURL + "/user" + "/login";
    if (payload.email.length > 0 && payload.password.length > 0) {
      try {
        const res = await Axios.post(urlLogin, payload);

        if (res.status === 200) {
          const user: User = res.data.data;
          user.refreshToken = "";
          this.context.commit(Mutations.SET_USER, user);
          this.context.dispatch(Actions.STORE_TO_BROWSER, res.data.accessToken);
          this.context.commit(Mutations.SET_PASSWORD, "");
          this.context.commit(Mutations.SET_AUTH_STATUS, true);
          return res.status;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("Actions.LOGIN - ERROR");
        console.log(error.response.status);
        console.log(error.response.data.message);
        return error;
      }
    }
  }
  @Action
  async [Actions.CHECK_MFA_STATUS]() {
    return new Promise<void>((resolve, reject) => {
      //
    });
  }

  @Action
  async [Actions.REGISTER_USER_TO_BC]() {
    return new Promise<void>((resolve, reject) => {
      //
    });
  }

  @Action
  async [Actions.CHECK_BC_AUTH_STATUS]() {
    return new Promise<void>((resolve, reject) => {
      //
    });
  }

  @Action
  async [Actions.SET_BC_AUTH_STATUS]() {
    return new Promise<void>((resolve, reject) => {
      //
    });
  }

  @Action
  async [Actions.REGISTER]() {
    return new Promise<void>((resolve, reject) => {
      //
    });
  }

  @Action
  async [Actions.COUNT_USERS]() {
    return new Promise<void>((resolve, reject) => {
      //
    });
  }

  @Action
  async [Actions.GET_USERS]() {
    return new Promise<void>((resolve, reject) => {
      //
    });
  }

  @Action
  async [Actions.GENERATE_QR]() {
    return new Promise<void>((resolve, reject) => {
      const generateQRUrl =
        ApiService.vueInstance.axios.defaults.baseURL + "/user" + "/generateQR";

      const data = {
        email: this.context.getters.user.email as string,
      };
      this.context.dispatch("checkMFAStatus", data).then((mfa) => {
        if (mfa.id != -1) return this.context.getters.mfa;
      });

      if (data.email.length > 0) {
        try {
          const token = localStorage.getItem("token") || null;
          if (token !== null && token !== "") {
            Axios.defaults.headers.post["Content-Type"] = "application/json";
            Axios.defaults.headers.post.Authorization = "Bearer " + token;
          }
          ApiService.post(generateQRUrl, data as AxiosRequestConfig).then(
            (res) => {
              const mfa: MFA = res.data.mfa;
              this.context.commit("setMFA", mfa);
            }
          );
          resolve(this.context.getters.mfa);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error);
          reject(error);
        }
      } else {
        router.push({ name: "register" });
      }
    });
  }

  @Action
  async [Actions.VALIDATE_MFA](token: string) {
    return new Promise<boolean>((resolve, reject) => {
      const verifyTokenUrl =
        ApiService.vueInstance.axios.defaults.baseURL + "/token" + "/verifyQR";
      const data = {
        id: this.context.getters.mfa.id as number,
        userId: this.context.getters.user.id as number,
        token: token as string,
        base32Secret: this.context.getters.mfa.base32 as string,
      };
      try {
        const token = localStorage.getItem("token") || null;
        if (token !== null && token !== "") {
          Axios.defaults.headers.post["Content-Type"] = "application/json";
          Axios.defaults.headers.post.Authorization = "Bearer " + token;
        }

        ApiService.post(verifyTokenUrl, data as AxiosRequestConfig).then(
          (res) => {
            const mfa: MFA = res.data.mfa;
            this.context.commit(Mutations.SET_MFA, mfa);
            this.context.dispatch(Actions.SANITAZE_MFA);
            if (mfa.verified) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("validateMFAToken Error");
        console.log(error);
        reject(error);
      }
    });
  }

  @Action
  async [Actions.SANITAZE_MFA]() {
    const mfa: MFA = {
      id: this.context.getters.mfa.id as number,
      userId: this.context.getters.mfa.userId as number,
      status: this.context.getters.mfa.status as boolean,
      verified: this.context.getters.mfa.verified as boolean,
      ascii: "",
      hex: "",
      base32: "",
      otpAuthUrl: "",
      qr: "",
    } as MFA;

    this.context.commit(Mutations.SET_MFA, mfa);
  }

  @Action
  async [Actions.RESET_MFA]() {
    return new Promise<boolean>((resolve, reject) => {
      const resetMfaUrl =
        ApiService.vueInstance.axios.defaults.baseURL + "/user" + "/reset";
      const data = {
        id: this.context.getters.mfa.id as number,
        userId: this.context.getters.user.id as number,
      };

      try {
        if (this.context.getters.mfa.id == -1) {
          return true;
        } else {
          const token = localStorage.getItem("token") || null;
          if (token !== null && token !== "") {
            ApiService.vueInstance.axios.defaults.headers.post["Content-Type"] =
              "application/json";
            ApiService.vueInstance.axios.defaults.headers.post.Authorization =
              "Bearer " + token;
          }

          ApiService.post(resetMfaUrl, data as AxiosRequestConfig);

          this.context.commit("setMFA", {
            id: -1,
            userId: -1,
            status: false,
            verified: false,
            ascii: "",
            hex: "",
            base32: "",
            otpAuthUrl: "",
            qr: "",
          } as MFA);
          resolve(true);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("resetMFA: " + error.response.data.message);
        reject(error);
      }
    });
  }

  @Action
  async [Actions.LOGOUT]() {
    localStorage.removeItem("token");
    this.context.commit(Mutations.SET_USER, {
      id: -1,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      refreshToken: "",
      mfaId: -1,
      baddress: "",
    });
    this.context.commit(Mutations.SET_MFA, {
      id: -1,
      userId: -1,
      status: false,
      verified: false,
      ascii: "",
      hex: "",
      base32: "",
      otpAuthUrl: "",
      qr: "",
    } as MFA);
    this.context.commit(Mutations.SET_AUTH_STATUS, false);
    this.context.commit(Mutations.CLEAR_USER_LIST);
    localStorage.removeItem("vuex");
    return true;
  }

  @Action
  async [Actions.STORE_TO_BROWSER](payload: string) {
    const key = "token";
    localStorage.setItem(key, payload);
  }
}
