<template>
  <div class="container">
    <div>
      <Metamask />
    </div>
    <div v-if="user.role === 'ADMIN'">
      <h1>
        Welcome {{ user.firstName }}
        <span class="badge badge-pill bg-success">{{ user.role }}</span>
      </h1>
    </div>
    <div v-if="user.role === 'MODERATOR'">
      <h1>
        Welcome {{ user.firstName }}
        <span class="badge badge-pill bg-primary">{{ user.role }}</span>
      </h1>
    </div>
    <div v-if="user.role === 'USER'">
      <h1>
        Welcome {{ user.firstName }}
        <span class="badge badge-pill bg-dark">{{ user.role }}</span>
      </h1>
    </div>
    <br />
    <div class="container">
      <BlockchainDashboard :role="user.role" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { BcUser, User } from "../../models/user.model";
import Metamask from "../Metamask.vue";
import BlockchainDashboard from "../blockchain/BlockchainDashboard.vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;
let user: User;
let counter: number;

export default {
  name: "BlockchainComponent",
  components: {
    BlockchainDashboard,
    Metamask,
  },
  data() {
    return {
      isTableVisible: false,
      headers: [] as string[],
      list: [] as BcUser[],
    };
  },
  setup() {
    store = useStore();
    user = ref(store.getters.user).value;
    counter = ref(store.getters.usersCounter).value;

    return {
      counter,
      user,
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
        for (const index in list) {
          let user = list[index];
          const userJson = JSON.parse(JSON.stringify(user)) as BcUser;
          list[index] = userJson;
        }
        this.list = list;
        this.isTableVisible = true;
      } else {
        this.isTableVisible = false;
      }
    },
  },
};
</script>
