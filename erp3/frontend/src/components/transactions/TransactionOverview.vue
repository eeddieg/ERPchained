<template>
  <div class="container">
    <h2>Transactions</h2>
    <div class="container py-3" id="flow">
      <TransactionFlow />
    </div>
  </div>
</template>

<script lang="ts">
import TransactionFlow from "./TransactionFlow.vue";

export default {
  name: "TransactionOverview",
  components: {
    TransactionFlow,
  },
};
</script>

<style scoped></style>
