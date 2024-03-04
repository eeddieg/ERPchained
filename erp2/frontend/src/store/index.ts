import { createStore } from "vuex";
// import createPersistedState from "vuex-persistedstate";
import { BcUser, User } from "../models/user.model";
import { MFA } from "../models/mfa.model";
import router from "../router";
import Axios from "../services/api/api.backend.service";
import AxiosBc from "../services/api/api.blockchain.service";
import BlockChainStoreModule from "./modules/blockchain.store";
import CompanyStoreModule from "./modules/company.store";
import ContractStoreModule from "./modules/contract.store";
import OrderStoreModule from "./modules/order.store";
import StatisticsStoreModule from "./modules/statistics.store";
import TokenStoreModule from "./modules/token.store";
// import UserStoreModule from "./modules/user.store";
import { VuexPersistence } from "vuex-persist";

const vuexLocalStorage = new VuexPersistence({
  key: "vuex",
  storage: window.localStorage,
});

// export default new Store({
export default createStore({
  plugins: [vuexLocalStorage.plugin],
  // plugins: [createPersistedState()],
  modules: {
    blockchain: BlockChainStoreModule,
    company: CompanyStoreModule,
    contract: ContractStoreModule,
    order: OrderStoreModule,
    statistics: StatisticsStoreModule,
    token: TokenStoreModule,
  },
  state: {
    user: {
      id: -1,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      refreshToken: "",
      mfaId: -1,
      address: "",
    },
    mfa: {
      id: -1,
      userId: -1,
      status: false,
      verified: false,
      ascii: "",
      hex: "",
      base32: "",
      otpAuthUrl: "",
      qr: "",
    },
    authenticated: false,
    bcAuth: false,
    userList: [] as object[],
    totalUsers: 0,
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
    isAuthOnBc(state) {
      return state.bcAuth;
    },
    mfa(state) {
      return state.mfa;
    },
    refreshToken(state) {
      return state.user.refreshToken;
    },
    usersCounter(state) {
      return state.totalUsers;
    },
    user(state) {
      return state.user;
    },
    userList(state) {
      return state.userList;
    },
  },
  mutations: {
    clearUserList(state) {
      state.userList.splice(0, state.userList.length);
    },
    setAuthenticatedStatus(state, payload: boolean) {
      state.authenticated = payload;
    },
    setBcAuthStatus(state, payload: boolean) {
      state.bcAuth = payload;
    },
    setRefreshTokenToken(state, payload: string) {
      state.user.refreshToken = payload;
    },
    setPassword(state, payload: string) {
      state.user.password = payload;
    },
    setUser(state, payload: User) {
      state.user = payload;
    },
    setUsersCounter(state, payload: number) {
      state.totalUsers = payload;
    },
    setUserList(state, payload: object[]) {
      state.userList = payload;
    },
    setMFA(state, payload: MFA) {
      state.mfa = payload;
    },
  },
  actions: {
    async logUser(content, payload) {
      const urlLogin = Axios.defaults.baseURL + "/user" + "/login";
      if (payload.email.length > 0 && payload.password.length > 0) {
        try {
          const res = await Axios.post(urlLogin, payload);

          if (res.status === 200) {
            const user: User = res.data.data;
            user.refreshToken = "";
            content.commit("setUser", user);
            content.dispatch(
              "storeToBrowserLocalStorage",
              res.data.accessToken
            );
            content.commit("setPassword", "");
            content.commit("setAuthenticatedStatus", true);
            return res.status;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error.response.data.message);
          return error.response.status;
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async checkMFAStatus(content, data: any) {
      const urlMfa = Axios.defaults.baseURL + "/user" + "/mfaStatus";
      try {
        if (data.email.length > 0) {
          const token = localStorage.getItem("token") || null;
          if (token != null && token !== "") {
            Axios.defaults.headers.post["Content-Type"] = "application/json";
            Axios.defaults.headers.post.Authorization = "Bearer " + token;
          }
          const res = await Axios.post(urlMfa, data);
          let mfa: MFA = res.data.mfa;
          if (mfa == null) {
            mfa = {
              id: -1,
              userId: -1,
              status: false,
              verified: false,
              ascii: "",
              hex: "",
              base32: "",
              otpAuthUrl: "",
              qr: "",
            } as MFA;
          }
          content.commit("setMFA", mfa);
          return mfa;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("checkMFAStatus Error:");
        console.log(error.response.data.message);
        return error.response.status;
      }
    },

    async enrollUserToBc(content, data: BcUser) {
      const user = JSON.parse(JSON.stringify(data));
      const company = content.getters.getCompanyName;
      user.company = company;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { firstName: _, lastName: __, ...payload } = user;

      const urlbl = AxiosBc.defaults.baseURL + "/user" + "/enroll";
      try {
        const res = await AxiosBc.post(urlbl, payload);
        const receipt = res.data.receipt;
        console.log("User already enrolled to blockchain: ");
        if (receipt.info) {
          console.log(receipt.info.error.data.message === "revert");
          return receipt.info.error.data;
        } else {
          console.log(!(receipt.blockHash !== null));
        }
        return receipt;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.response.data.message);
        return error.response.status;
      }
    },

    async getNextAvailableBcAddress() {
      const url = Axios.defaults.baseURL + "/account" + "/nextUnassigned";
      const token = localStorage.getItem("token") || null;
      if (token != null && token !== "") {
        AxiosBc.defaults.headers.get["Content-Type"] = "application/json";
        AxiosBc.defaults.headers.get.Authorization = "Bearer " + token;
      }

      try {
        const res = await AxiosBc.get(url);
        return res.data.unassigned.address;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("getNextAvailableBcAddress - ERROR");
        console.log(error.response.data.message);
        return error.response.status;
      }
    },

    async checkAuthStatusOnBc(content, address: string) {
      const urlbl = AxiosBc.defaults.baseURL + "/user" + "/getAuthStatus";
      const token = localStorage.getItem("token") || null;
      if (token != null && token !== "") {
        AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
        AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
      }

      try {
        const payload = {
          address,
        };
        const res = await AxiosBc.post(urlbl, payload);
        const owner = content.getters.user.address as User;
        if (address === owner.address) {
          content.commit("setBcAuthStatus", res.data.authStatus);
        }
        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.response.data.message);
        return error.response.status;
      }
    },

    async setAuthStatusOnBc(content, payload) {
      const urlbl = AxiosBc.defaults.baseURL + "/user" + "/setAuthStatus";
      const token = localStorage.getItem("token") || null;
      if (token != null && token !== "") {
        AxiosBc.defaults.headers.post["Content-Type"] = "application/json";
        AxiosBc.defaults.headers.post.Authorization = "Bearer " + token;
      }

      try {
        await AxiosBc.post(urlbl, payload);
        const status = Boolean(payload.status);
        content.commit("setBcAuthStatus", status);
        return status;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.response.data.message);
        return error.response.status;
      }
    },

    async registerUser(content, payload: User) {
      const url = Axios.defaults.baseURL + "/user" + "/register";
      const urlbl = AxiosBc.defaults.baseURL + "/user" + "/enroll";

      if (payload.email.length > 0 && payload.password.length > 0) {
        try {
          const res = await Axios.post(url, payload);
          if (res.status) {
            const regUser: User = res.data.user;
            // remove sensitive fields
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              password: _,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              refreshToken: __,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              mfaId: ___,
              ...sanitizedUser
            } = regUser;
            content.commit("setUser", sanitizedUser);

            //Send to blockchain
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              firstName: ____,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              lastName: _____,
              ...newSanitizedUser
            } = sanitizedUser;

            const newPayload = {
              ...newSanitizedUser,
              company: content.getters.getCompanyName,
            };

            await AxiosBc.post(urlbl, newPayload);
            // const receipt = await AxiosBc.post(urlbl, newPayload);

            return res.status;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error.response.data.message);
          return error.response.status;
        }
      } else {
        router.push({ name: "register" });
      }
    },

    async countAllUsers(content) {
      const url = Axios.defaults.baseURL + "/user" + "/countUsers";
      const token = localStorage.getItem("token") || null;
      if (token != null && token !== "") {
        Axios.defaults.headers.get["Content-Type"] = "application/json";
        Axios.defaults.headers.get.Authorization = "Bearer " + token;
      }

      try {
        await Axios.get(url).then((res) => {
          content.commit("setUsersCounter", res.data.counter);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("getAllUsers - ERROR");
        console.log(error);
      }
    },

    async getAllUsers(content) {
      content.commit("clearUserList");
      const url = Axios.defaults.baseURL + "/user" + "/listUsers";
      const token = localStorage.getItem("token") || null;
      if (token != null && token !== "") {
        Axios.defaults.headers.get["Content-Type"] = "application/json";
        Axios.defaults.headers.get.Authorization = "Bearer " + token;
      }

      try {
        await Axios.get(url).then((response) => {
          const userList = [] as object[];
          const list = response.data.userList as User[];
          for (const user of list) {
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              password: _,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              refreshToken: __,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              mfaId: ___,
              ...sanitizedUser
            } = user;
            userList.push(sanitizedUser);
          }
          content.commit("setUserList", userList);
        });
        return await content.getters.userList;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("getAllUsers - ERROR");
        console.log(error);
      }
    },

    async generateQrCode(content) {
      const generateQRUrl = Axios.defaults.baseURL + "/user" + "/generateQR";
      const data = {
        email: content.getters.user.email as string,
      };
      const mfa = await content.dispatch("checkMFAStatus", data);

      if (mfa.id != -1) return content.getters.mfa;

      if (data.email.length > 0) {
        try {
          const token = localStorage.getItem("token") || null;
          if (token !== null && token !== "") {
            Axios.defaults.headers.post["Content-Type"] = "application/json";
            Axios.defaults.headers.post.Authorization = "Bearer " + token;
          }
          await Axios.post(generateQRUrl, data).then((res) => {
            const mfa: MFA = res.data.mfa;
            content.commit("setMFA", mfa);
          });
          return content.getters.mfa;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error.response.data.message);
          return error.response.status;
        }
      } else {
        router.push({ name: "register" });
      }
    },

    async validateMFAToken(content, token: string) {
      const verifyTokenUrl = Axios.defaults.baseURL + "/user" + "/verifyQR";
      const data = {
        id: content.getters.mfa.id as number,
        userId: content.getters.user.id as number,
        token: token as string,
        base32Secret: content.getters.mfa.base32 as string,
      };

      try {
        const token = localStorage.getItem("token") || null;
        if (token !== null && token !== "") {
          Axios.defaults.headers.post["Content-Type"] = "application/json";
          Axios.defaults.headers.post.Authorization = "Bearer " + token;
        }

        const res = await Axios.post(verifyTokenUrl, data);
        const mfa: MFA = res.data.mfa;

        await content.commit("setMFA", mfa);
        await content.dispatch("sanitizeMFARecord");

        if (mfa.verified) {
          return true;
        } else {
          return false;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("validateMFAToken Error");
        return error.response.data.status;
      }
    },

    // After a successful login, remove refresh token from store.
    // If needed, retrieve it from DB.
    sanitizeMFARecord(content) {
      const mfa: MFA = {
        id: content.getters.mfa.id as number,
        userId: content.getters.mfa.userId as number,
        status: content.getters.mfa.status as boolean,
        verified: content.getters.mfa.verified as boolean,
        ascii: "",
        hex: "",
        base32: "",
        otpAuthUrl: "",
        qr: "",
      } as MFA;

      content.commit("setMFA", mfa);
    },

    async resetMFA(content) {
      const resetMfaUrl = Axios.defaults.baseURL + "/user" + "/reset";
      const data = {
        id: content.getters.mfa.id as number,
        userId: content.getters.user.id as number,
      };

      try {
        if (content.getters.mfa.id == -1) {
          return true;
        } else {
          const token = localStorage.getItem("token") || null;
          if (token !== null && token !== "") {
            Axios.defaults.headers.post["Content-Type"] = "application/json";
            Axios.defaults.headers.post.Authorization = "Bearer " + token;
          }

          await Axios.post(resetMfaUrl, data);

          content.commit("setMFA", {
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
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("resetMFA: " + error.response.data.message);
        return error.response.status;
      }
    },

    async logout(content) {
      localStorage.removeItem("token");
      content.commit("setUser", {
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
      content.commit("setMFA", {
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
      await content.commit("setAuthenticatedStatus", false);
      await content.commit("clearUserList");
      localStorage.removeItem("vuex");
      return true;
    },

    storeToBrowserLocalStorage(content, payload: string) {
      const key = "token";
      localStorage.setItem(key, payload);
    },
  },
});
