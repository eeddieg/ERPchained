<template>
  <div v-if="isDialogVisible" class="dialog-overlay">
    <div class="dialog">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <button class="btn btn-primary mx-2" @click="chooseAction('confirm')">
        Confirm
      </button>
      <button class="btn btn-primary mx-2" @click="chooseAction('cancel')">
        Cancel
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ConfirmDialog",
  props: ["title", "message", "isDialogVisible"],
  methods: {
    chooseAction(state: string) {
      this.$emit("dialog-event", state);
    },
  },
};
</script>

<style>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background-color: rgb(90, 100, 100);
  padding: 1rem;
  border-radius: 0.5rem;
  width: 50%;
}
</style>
