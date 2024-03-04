<template>
  <div>
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
    </div>
    <h1>Login</h1>
    <LoginForm />
    <div class="info">
      <i
        >Still not registered? Sign up
        <router-link to="register">here</router-link></i
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import LoginForm from "../components/login/LoginForm.vue";
import NavBar from "../components/NavBar.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "LoginView",
  components: {
    LoginForm,
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

<style>
.info {
  margin-top: 10px;
}
</style>
