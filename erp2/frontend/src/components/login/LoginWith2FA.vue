<template>
  <div class="modal-mask">
    <div class="modal-container">
      <header>
        <h3>Two Factor Authentication</h3>
      </header>
      <div class="register-form d-inline-flex col-5">
        <form
          id="form"
          class="g-3 needs-validation"
          @submit.prevent="validateToken(token)"
        >
          <div class="row mb-4">
            <div class="col">
              <label class="form-control" for="inputToken">
                Enter validation token from your Authenticator app.
              </label>
              <input
                v-model="token"
                type="number"
                name="token"
                id="inputToken"
              />
            </div>
          </div>
          <button class="btn btn-primary" name="button">Validate</button>
          <button
            class="btn btn-danger"
            name="logoutButton"
            @click="this.logout()"
          >
            Cancel
          </button>
        </form>
        <p>{{ validationMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import router from "../../router";

export default {
  name: "LoginWith2FAComponent",
  props: {
    show: Boolean,
    tittle: String,
  },
  data() {
    return {
      token: "",
      validationMessage: "",
    };
  },
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  methods: {
    async validateToken(token: string) {
      const padded = parseInt(token, 10).toString().padStart(6, "0");
      if (token.length != 0 && padded.length == 6) {
        await this.store
          .dispatch("validateMFAToken", padded)
          .then((res: boolean) => {
            if (res) {
              router.push({ name: "home" });
            } else {
              router.push({ name: "logout" });
            }
          });
      } else {
        alert("Mispelled verification token.");
      }
    },
  },
  async logout() {
    router.push({ name: "logout" });
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
}
.modal-container {
  background: white;
  padding: 1rem;
  width: 65vw;
  max-width: 600px;
}
button {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
