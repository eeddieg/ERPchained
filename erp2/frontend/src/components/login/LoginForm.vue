<template>
  <div>
    <div class="login-form d-inline-flex col-5">
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email-input" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email-input"
            aria-describedby="emailHelp"
            v-model="user.email"
          />
          <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div class="mb-3">
          <label for="password-input" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password-input"
            v-model="user.password"
          />
        </div>
        <button
          type="button"
          class="btn btn-primary"
          @click="login"
          :disabled="!isComplete"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import router from "../../router";

export default {
  name: "LoginForm",
  setup() {
    const store = useStore();

    let user = reactive({
      email: "",
      password: "",
    });

    const isComplete = computed({
      get() {
        return user.email != "" && user.password != "";
      },
      set() {
        //
      },
    });

    async function login() {
      if (user.email.length > 0 && user.password.length > 0) {
        await store.dispatch("logUser", user).then((res) => {
          if (res == 200) {
            const data = {
              email: user.email,
            };
            store.dispatch("checkMFAStatus", data).then((mfa) => {
              if (mfa.verified) {
                router.push({ name: "loginWith2FA" });
              } else {
                router.push({ name: "home" });
              }
            });
          }
        });
      }
    }

    return {
      isComplete,
      user,
      login,
    };
  },
};
</script>

<style>
.login-form {
  justify-content: center;
}
.form-check {
  display: "d-inline-block";
}
</style>
