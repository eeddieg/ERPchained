<template>
  <div class="dashboard">
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
    </div>
    <div>
      <!-- <Metamask /> -->
    </div>
    <Blockchain />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Blockchain from "../components/blockchain/Blockchain.vue";
// import Metamask from "../components/Metamask.vue";
import NavBar from "../components/NavBar.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "BlockchainView",
  components: {
    Blockchain,
    // Metamask,
    NavBar,
  },
  data() {
    const store = useStore();
    const auth = ref(store.getters.isAuthenticated).value;
    const user = ref(store.getters.user).value;
    const role = user.role;

    return {
      auth,
      role,
    };
  },
});
</script>
