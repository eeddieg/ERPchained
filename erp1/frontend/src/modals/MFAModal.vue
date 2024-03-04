<template>
  <div class="modal-mask" v-if="show">
    <div class="modal-container">
      <header>
        <h3>Two Factor Authentication</h3>
      </header>
      <div>
        <form>
          <label class="form-text" for="inputToken">
            Enter token to enable two factor authentication.
          </label>
          <div>
            <img :src="qr" alt="qrCode" id="qr" />
          </div>
          <input v-model="token" type="text" name="token" id="inputToken" />
          <button
            class="btn btn-primary"
            name="button"
            @click.prevent="$emit('validate', token)"
          >
            Validate
          </button>
        </form>
        <p>{{ validationMessage }}</p>
      </div>
      <footer>
        <button class="btn btn-danger" @click="$emit('close')">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";

export default {
  name: "MFAModal",
  props: {
    show: Boolean,
    qr: String,
  },
  data() {
    return {
      token: "",
      validationMessage: "",
      store: useStore(),
    };
  },
  created() {
    this.store = useStore();
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
