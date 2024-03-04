<template>
  <div class="container">
    <section>
      <div class="container">
        <div class="main-body">
          <div class="container">
            <div class="row justify-content-center">
              <div class="row card align-content-center w-50">
                <div class="card-body">
                  <div class="">
                    <h4 class="d-flex mb-3">Blockchain Info</h4>
                  </div>
                  <div class="form-check form-switch">
                    <!-- Spinner -->
                    <div id="overlay">
                      <div
                        class="spinner-border text-primary"
                        role="status"
                        v-show="isSpinnerVisible"
                      ></div>
                      <!-- Progress bar-->
                      <div
                        class="container my-4 w-25 justify-content-center"
                        v-show="isProgressVisible"
                      >
                        <div class="container my-4" id="progress-info">
                          <span> {{ message }}</span>
                        </div>
                        <div class="progress" style="height: 25px">
                          <div
                            id="progress-bar"
                            class="progress-bar"
                            role="progressbar"
                            style="width: 75%"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                      <!-- END: Progress bar-->
                    </div>
                    <!-- Table Radio button -->
                    <div class="row mb-3">
                      <div class="col-sm-6" v-if="owner.role !== USER">
                        <label class="form-check-label switch" for="mfa-switch">
                          Show {{ counter }} available users
                        </label>
                      </div>
                      <div class="col-sm-6" v-else>
                        <label class="form-check-label switch" for="mfa-switch">
                          Show user status
                        </label>
                      </div>
                      <div
                        class="col-sm-3 text-secondary"
                        style="margin-left: 20px"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="userlist-switch"
                          @click="getUserList()"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="container" v-show="isTableVisible">
                <div class="row col-sm-12 pt-4 w-100 justify-content-center">
                  <div class="w-75 justify-content-center">
                    <table
                      class="table table-sm table-bordered table-hover table-secondary text-center"
                    >
                      <thead>
                        <th v-for="(header, i) in headers" :key="i" scope="col">
                          {{ header.toUpperCase() }}
                        </th>
                        <th scope="col">Connect to BC</th>
                      </thead>
                      <tbody
                        class="table-group-divider"
                        v-if="owner.role !== 'USER'"
                      >
                        <tr v-for="(user, i) in list" :key="i">
                          <th class="col">{{ user.id }}</th>
                          <td class="col">{{ user.firstName }}</td>
                          <td class="col">{{ user.lastName }}</td>
                          <td class="col-2">{{ user.email }}</td>
                          <td class="col-2">{{ user.role }}</td>
                          <td id="user-address" class="col-4">
                            {{ user.address }}
                          </td>
                          <td>
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="'user-' + `${user.id}` + '-bc-switch'"
                              @click="connectUserToBc(user)"
                            />
                          </td>
                        </tr>
                      </tbody>
                      <tbody class="table-group-divider font-monospace" v-else>
                        <tr>
                          <th>{{ owner.id }}</th>
                          <td>{{ owner.firstName }}</td>
                          <td>{{ owner.lastName }}</td>
                          <td>{{ owner.email }}</td>
                          <td>{{ owner.role }}</td>
                          <td id="user-address">{{ owner.address }}</td>
                          <td>
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="owner-bc-switch"
                              @click="connectUserToBc(owner)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { AuthStatus, BcUser, User, UserRole } from "../../models/user.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;
let owner: User;
let counter: number;
const USER = UserRole.USER;

export default {
  name: "BlockchainDashboardComponent",
  props: ["role"],
  data() {
    return {
      isProgressVisible: false,
      isSpinnerVisible: false,
      isTableVisible: false,
      headers: [] as string[],
      list: [] as BcUser[],
      message: "",
    };
  },
  setup() {
    store = useStore();
    owner = ref(store.getters.user).value;
    counter = ref(store.getters.usersCounter).value;

    return {
      counter,
      owner,
      USER,
    };
  },
  methods: {
    async getUserList() {
      const listSwitch = document.getElementById(
        "userlist-switch"
      ) as HTMLInputElement;
      let headers = [] as string[];

      if (listSwitch.checked) {
        let list = [] as BcUser[];
        list = await store.getters.userList;
        if (list.length === 0) {
          list = await store.dispatch("getAllUsers");
        }
        // get keys as table headers and values separately
        const user = list[0];
        Object.keys(user).forEach((key: string) => {
          headers.push(key);
        });
        this.headers = headers;

        if (owner.role !== UserRole.USER) {
          for (const index in list) {
            let user = list[index];
            const userJson = JSON.parse(JSON.stringify(user)) as BcUser;
            list[index] = userJson;
          }
          this.list = list;
        }
        await this.checkAuthStatusOnBc(this.list);
        this.isTableVisible = true;
      } else {
        this.isTableVisible = false;
      }
    },

    async checkAuthStatusOnBc(arr: BcUser[]) {
      if (owner.role !== UserRole.USER) {
        for (const user of arr) {
          const res = await store.dispatch("checkAuthStatusOnBc", user.address);
          const status: AuthStatus =
            res.authStatus === 0 ? AuthStatus.NO : AuthStatus.YES;

          const id = "user-" + user.id + "-bc-switch";
          const bcCheckBox = document.getElementById(id) as HTMLInputElement;
          if (status) {
            bcCheckBox.checked = true;
          }
          if (owner.role !== UserRole.ADMIN) {
            bcCheckBox.disabled = true;
            // bcCheckBox.style.display = "none";
          }
        }
      } else {
        const res = await store.dispatch("checkAuthStatusOnBc", owner.address);
        const status: AuthStatus =
          res.authStatus === 0 ? AuthStatus.NO : AuthStatus.YES;

        const id = "owner-bc-switch";
        const bcCheckBox = document.getElementById(id) as HTMLInputElement;
        if (status) {
          bcCheckBox.checked = true;
        }
        bcCheckBox.disabled = true;
        // bcCheckBox.style.display = "none";
      }
    },

    async connectUserToBc(user: BcUser) {
      const id = "user-" + user.id + "-bc-switch";
      const bcCheckBox = document.getElementById(id) as HTMLInputElement;

      const payload = {
        address: user.address,
        status: AuthStatus.NO,
      };

      if (bcCheckBox.checked) {
        this.message = `Registering User #${user.id} on Blockchain`;
        this.enableProgressBar();
        this.updateProgressBar(0);

        await store.dispatch("enrollUserToBc", user);
        this.updateProgressBar(60);

        payload.status = AuthStatus.YES;
        this.updateProgressBar(80);

        await store.dispatch("setAuthStatusOnBc", payload);
        this.updateProgressBar(100);
        this.disableProgressBar();
        this.message = "";
      } else {
        this.initSpinner();
        await store.dispatch("setAuthStatusOnBc", payload);
        this.disableSpinner();
      }
    },
    disableProgressBar() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isProgressVisible = false;
      overlay.style.display = "none";
    },
    disableSpinner() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isSpinnerVisible = false;
      overlay.style.display = "none";
    },
    enableProgressBar() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isProgressVisible = true;
      overlay.style.display = "block";
    },
    initSpinner() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isSpinnerVisible = true;
      overlay.style.display = "block";
    },
    updateProgressBar(value: number) {
      const pbar = document.getElementById("progress-bar") as HTMLInputElement;
      const progress = String(value) + "%";
      pbar.style.width = progress;
      pbar.innerText = progress;
    },
  },
};
</script>
<style scoped>
table {
  font-size: small;
  width: 100%;
}
#user-address {
  color: blue;
  font-size: x-small;
}
#overlay {
  display: none;
  background: #1d1a1a;
  color: #666666;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 5000;
  top: 0;
  left: 0;
  float: left;
  text-align: center;
  padding-top: 25%;
  opacity: 0.8;
}
.table tr th:nth-child(2) {
  width: 50%;
}
#progress-info {
  color: crimson;
  font-size: large;
  font-weight: 900;
}
</style>
