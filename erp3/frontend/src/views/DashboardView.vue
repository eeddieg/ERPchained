<template>
  <div class="dashboard">
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
    </div>
    <Dashboard />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Dashboard from "../components/dashboard/Dashboard.vue";
import NavBar from "../components/NavBar.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "DashboardView",
  components: {
    Dashboard,
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
