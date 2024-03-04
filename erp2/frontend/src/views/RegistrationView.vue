<template>
  <div>
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
    </div>
    <h1>Sign up</h1>
    <RegistrationForm />
    <div class="info">
      <i
        >Have you already signed up? Log in
        <router-link to="register">here</router-link></i
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import RegistrationForm from "../components/register/RegistrationForm.vue";
import NavBar from "../components/NavBar.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "RegistrationView",
  components: {
    NavBar,
    RegistrationForm,
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
