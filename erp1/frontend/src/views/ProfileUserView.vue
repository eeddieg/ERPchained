<template>
  <div class="dashboard">
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
    </div>
    <UserProfile />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import UserProfile from "../components/profiles/ProfileUser.vue";
import NavBar from "../components/NavBar.vue";

export default defineComponent({
  name: "DashboardView",
  components: {
    UserProfile,
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
