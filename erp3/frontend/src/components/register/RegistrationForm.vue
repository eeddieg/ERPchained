<template>
  <div>
    <h1></h1>
    <div class="register-form d-inline-flex col-5">
      <form>
        <!-- 2 column grid layout with text inputs for the first and last names -->
        <div class="row mb-4">
          <div class="col">
            <div class="form-outline">
              <input
                type="text"
                id="first-name"
                class="form-control"
                v-model="user.firstName"
              />
              <label class="form-label" for="first-name">First name</label>
            </div>
          </div>
          <div class="col">
            <div class="form-outline">
              <input
                type="text"
                id="last-name"
                class="form-control"
                v-model="user.lastName"
              />
              <label class="form-label" for="last-name">Last name</label>
            </div>
          </div>
        </div>

        <!-- Email input -->
        <div class="form-outline mb-4">
          <input
            type="email"
            id="input-email"
            class="form-control"
            v-model="user.email"
            required
          />
          <label class="form-label" for="input-email">Email address</label>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
          <input
            type="password"
            id="input-password"
            class="form-control"
            v-model="user.password"
            required
          />
          <label class="form-label" for="input-password">Password</label>
        </div>

        <!-- Submit button -->
        <button
          type="button"
          class="btn btn-primary btn-block mb-4"
          :disabled="!isComplete"
          @click="submitForm"
        >
          Sign up
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import { UserRole } from "../../models/user.model";
// import Swal from "vue-sweetalert2";
import router from "../../router";

export default {
  name: "LoginForm",
  setup() {
    const store = useStore();

    let user = reactive({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: UserRole.USER,
    });

    const isComplete = computed({
      get() {
        return user.email != "" && user.password != "";
      },
      set() {
        //
      },
    });

    async function submitForm() {
      if (user.email.length > 0 && user.password.length > 0) {
        try {
          await store.dispatch("registerUser", user).then((res) => {
            if (res === 200) {
              router.push({ name: "login" });
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    return {
      user,
      isComplete,
      submitForm,
    };
  },
};
</script>

<style>
.register-form {
  justify-content: center;
}
.form-check {
  display: "d-inline-block";
}
</style>
