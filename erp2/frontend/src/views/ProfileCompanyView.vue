<template>
  <div class="dashboard">
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
    </div>
    <CompanyProfile />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import CompanyProfile from "../components/profiles/ProfileCompany.vue";
import NavBar from "../components/NavBar.vue";

export default defineComponent({
  name: "DashboardView",
  components: {
    CompanyProfile,
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
