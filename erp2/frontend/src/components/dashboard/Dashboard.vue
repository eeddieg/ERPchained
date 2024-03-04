<template>
  <div class="dashboard">
    <Metamask />
    <h2>Dashboard</h2>
    <div v-show="isBcAuth">
      <DashboardOverview :owner="user" />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { User } from "../../models/user.model";
import Metamask from "../Metamask.vue";
import DashboardOverview from "./Dashboard.Overview.vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;

export default {
  name: "DashboardComponent",
  components: {
    DashboardOverview,
    Metamask,
  },
  data() {
    return {
      headers: [
        "ID",
        "FirstName",
        "LastName",
        "E-mail",
        "password",
        "Role",
        "AccessToken",
      ],
      isBcAuth: false,
    };
  },
  created() {
    store = useStore();
    const user: User = reactive(store.getters.user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch("checkAuthStatusOnBc", user.address).then((res: any) => {
      this.isBcAuth = res.authStatus;
    });
  },
  setup() {
    const store = useStore();
    const counter = ref(store.getters.usersCounter).value;
    if (counter === 0) {
      store.dispatch("countAllUsers");
    }
    const user: User = reactive(store.getters.user);
    return {
      user,
    };
  },
};
</script>

<style>
td {
  white-space: normal !important;
  word-wrap: break-word;
  min-width: 10px;
  max-width: 10px;
}
span {
  margin-left: 15px;
}
</style>
