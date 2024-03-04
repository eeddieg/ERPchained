<template>
  <div class="container">
    <!-- Spinner -->
    <div id="overlay">
      <!-- Progress bar-->
      <div
        class="container my-4 w-25 justify-content-center"
        v-show="isProgressVisible"
      >
        <div class="container my-4" id="progress-info">
          <span>{{ message }}</span>
        </div>
        <div class="progress" style="height: 25px">
          <div
            id="progress-bar"
            class="progress-bar"
            role="progressbar"
            style="width: 75%"
            aria-valuenow="100"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      <!-- END: Progress bar-->
    </div>
    <div class="container row" v-show="isOrderListFetched">
      <div class="pt-4 col-sm-12" v-show="isOrderListRequested">
        <div class="container row pt-1 pb-4 justify-content-center">
          <h3 class="col-sm-4">Orders of {{ title }}</h3>
          <div class="col-sm-2">
            <button class="btn btn-secondary" @click="hideTable">Hide</button>
          </div>
        </div>
        <div class="w-auto">
          <table
            id="order-overview-table"
            class="table table-sm table-striped table-bordered table-hover table-secondary"
          >
            <thead>
              <th v-for="(header, i) in orderListHeaders" :key="i" scope="col">
                {{ header.toUpperCase() }}
              </th>
            </thead>
            <tbody class="table-group-divider">
              <tr
                v-for="(order, i) in orderList"
                :key="i"
                :id="`orders-table-${order}-${i}`"
              >
                <th>
                  <a href="#" @click="fetchOrderById(order.id)">
                    {{ order.id }}
                  </a>
                </th>
                <td>{{ new Date(order.createdAt) }}</td>
                <td>{{ new Date(order.deliveredAt) }}</td>
                <td>{{ order.type }}</td>
                <td>{{ order.status }}</td>
              </tr>
            </tbody>
          </table>
          <i>Click on the order ID to view order details</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;

export default {
  name: "OrdersTable",
  props: ["title", "orderListHeaders", "orderList", "isOrderListFetched"],
  data() {
    return {
      isOrderDetailsRequested: false,
      isOrderListRequested: true,
      isProgressVisible: false,
      message: "",
    };
  },
  setup() {
    store = useStore();

    return {
      store,
    };
  },
  methods: {
    hideTable() {
      this.$emit("hideOrderTable");
    },
    resetVisibility() {
      this.$emit("hideOrderDetailsTable");
    },
    async fetchOrderById(id: number) {
      this.message = `Registering Order #${id} on Blockchain `;
      this.enableProgressBar();
      this.updateProgressBar(0);

      this.isOrderDetailsRequested = false;
      this.updateProgressBar(25);

      const order = await store.dispatch("getOrderById", id);
      this.updateProgressBar(40);
      const resources = await store.dispatch("getResourcesByOrderId", id);
      this.updateProgressBar(65);
      const receipt = await store.dispatch("getOrderReceiptByOrderId", id);
      this.updateProgressBar(80);

      const payload = {
        orderId: order.id,
        customerId: order.customerId,
        receiptId: receipt.id,
        product: resources.title,
        amount: resources.amount,
        createdAt: new Date(order.createdAt),
        deliveredAt: new Date(order.deliveredAt),
        orderType: order.type,
        orderStatus: order.status,
        bcStatus: receipt.status,
        sendTo: receipt.to,
        receivedFrom: receipt.from,
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        transaction: receipt.hash,
      };

      this.updateProgressBar(90);
      this.$emit("orderRequested", payload);

      this.updateProgressBar(100);
      this.disableProgressBar();
      this.message = "";
    },
    enableProgressBar() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isProgressVisible = true;
      overlay.style.display = "block";
    },
    updateProgressBar(value: number) {
      const pbar = document.getElementById("progress-bar") as HTMLInputElement;
      const progress = String(value) + "%";
      pbar.style.width = progress;
      pbar.innerText = progress;
    },
    disableProgressBar() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isProgressVisible = false;
      overlay.style.display = "none";
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
  text-align: center;
  width: 100% !important;
}
#overlay {
  display: none;
  background: #1d1a1a;
  color: #666666;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 5000;
  top: 0;
  left: 0;
  float: left;
  text-align: center;
  padding-top: 25%;
  opacity: 0.8;
}
#progress-info {
  color: crimson;
  font-size: large;
  font-weight: 900;
}
</style>
