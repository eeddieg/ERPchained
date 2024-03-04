<template>
  <div class="home">
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
      <Metamask v-show="auth" />
      <StatisticsComponent :auth="auth" v-show="auth" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Metamask from "../components/Metamask.vue";
import NavBar from "../components/NavBar.vue";
import StatisticsComponent from "../components/charts/Statistics.vue";
import { useStore } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any = null;

export default defineComponent({
  name: "HomeView",
  components: {
    Metamask,
    NavBar,
    StatisticsComponent,
  },
  setup() {
    store = useStore();
    const auth = ref(store.getters.isAuthenticated).value;

    let user = null;
    let role = null;
    if (auth) {
      user = ref(store.getters.user).value;
      role = user.role;
    }

    return {
      auth,
      role,
      store,
    };
  },
});
</script>
