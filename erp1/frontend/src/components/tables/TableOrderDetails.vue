<template>
  <div class="container">
    <div class="pt-4 col-sm-12">
      <div class="container row pt-1 pb-4 justify-content-center">
        <h3 class="col-sm-3">Order #{{ order[0] }} details</h3>
        <div class="col-sm-2">
          <button class="btn btn-secondary" @click="hideTable()">Hide</button>
        </div>
      </div>
      <div class="container">
        <table
          id="order-details-table"
          class="table table-sm table-striped table-bordered table-hover table-secondary"
        >
          <tr v-for="(header, i) in headers" :key="i">
            <th class="col-3" style="text-align: left">
              {{ header.toUpperCase() }}
            </th>
            <td class="col-8" style="text-align: left">{{ order[i] }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "OrderDetails",
  props: ["order"],
  setup() {
    const headers = [
      "Order ID",
      "Customer ID",
      "Receipt ID",
      "Product",
      "Amount",
      "Created At",
      "Delivered At",
      "Order Type",
      "Order Status",
      "BC Status",
      "Send To",
      "Received From",
      "Block Hash",
      "Block Number",
      "Transaction",
    ];
    return {
      headers,
    };
  },
  methods: {
    hideTable() {
      this.$emit("hideOrderDetailsTable");
    },
  },
};
</script>

<style scoped>
table th {
  text-align: center;
}
.table {
  justify-content: center;
  justify-self: center;
  margin: auto;
  margin-bottom: 50px;
  text-align: left;
  width: 100% !important;
}
#order-details-table {
  width: max-content;
}
</style>
