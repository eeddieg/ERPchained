<template>
  <div class="container">
    <!-- Spinner -->
    <div id="overlay" v-show="isSpinnerVisible">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Updating...</span>
      </div>
    </div>
    <!-- END: Spinner -->
    <div class="row">
      <div class="pt-4 col-sm-12">
        <div class="row pt-1 pb-4 justify-content-center">
          <h3 class="col-sm-6">Demo Generated Orders</h3>
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
                <td class="col">
                  <a href="#" @click="fetchOrderById(order.id)">
                    {{ order.id }}
                  </a>
                </td>
                <td class="col">{{ order.amount }}</td>
                <td class="col-2">{{ order.title }}</td>
                <td class="col-2">{{ order.createdAt }}</td>
                <td class="col">{{ order.deliveredAt }}</td>
                <td class="col">{{ order.type }}</td>
                <td class="col-2">{{ order.status }}</td>
                <td class="col">{{ order.blockNumber }}</td>
                <td class="col-2">{{ order.blockHash }}</td>
                <td class="col-2">{{ order.hash }}</td>
                <td class="col-2">
                  <button
                    :id="`updateBtn-${order.id}`"
                    class="btn btn-primary"
                    type="button"
                    @click="updateOrder(order.id)"
                    disabled
                  >
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- <i>Click on the order ID to view order details</i> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { OrderStatusBc } from "../../models/order.model";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;
let isUpdateBtnEnabled: boolean;

export default {
  name: "GeneratedOrders",
  props: ["orderListHeaders", "orderList", "isVisible"],
  data() {
    return {
      isSpinnerVisible: false,
      message: "asdfasdf",
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props: any) {
    store = useStore();
    // console.log(props);

    const show = ref(props.isVisible);
    watch(show, () => {
      isUpdateBtnEnabled = show;
      console.log("GeneratedOrders");
      console.log(isUpdateBtnEnabled);
    });

    // const { isUpdateBtnEnabled } = toRefs(isUpdateBtnEnabled);
    return {
      store,
    };
  },
  methods: {
    async fetchOrderById(id: number) {
      const order = await store.dispatch("getOrderById", id);
      const resources = await store.dispatch("getResourcesByOrderId", id);
      const receipt = await store.dispatch("getOrderReceiptByOrderId", id);

      const payload = {
        orderId: order.id,
        customerId: order.customerId,
        receiptId: receipt.id,
        product: resources.title,
        amount: resources.amount,
        createdAt: new Date(order.createdAt).toUTCString(),
        deliveredAt: new Date(order.deliveredAt).toUTCString(),
        orderType: order.type,
        orderStatus: order.status,
        bcStatus: receipt.status,
        sendTo: receipt.to,
        receivedFrom: receipt.from,
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        transaction: receipt.hash,
      };
      console.log(payload);
    },
    setUpdateBtnVisibility(state: boolean) {
      if (this.orderList.length > 0) {
        for (const order of this.orderList) {
          const updateBtn = document.getElementById(
            `updateBtn-${order.id}`
          ) as HTMLButtonElement;

          if (state) {
            updateBtn.disabled = false;
          } else {
            updateBtn.disabled = true;
          }
        }
      }
    },
    async updateOrder(orderId: number) {
      this.isSpinnerVisible = true;
      this.message = `Updating Order with ID: ${orderId}`;

      const date = new Date();
      const state = OrderStatusBc.COMPLETED;

      await this.updateOrderOnBc(date, orderId, state);
      await this.updateOrderOnDb(date, orderId, state);

      const updateBtn = document.getElementById(
        `updateBtn-${orderId}`
      ) as HTMLButtonElement;
      updateBtn.disabled = true;

      this.isSpinnerVisible = false;
    },
    async updateOrderOnBc(date: Date, orderId: number, state: OrderStatusBc) {
      const payloadDateBc = {
        address: store.getters.user.address,
        company: store.getters.getCompanyName,
        deliveredAt: Date.parse(date.toUTCString()) as number,
        orderId,
      };
      await store.dispatch("updateOrderDeliveryDateOnBc", payloadDateBc);

      const payloadStatusBc = {
        address: payloadDateBc.address,
        company: payloadDateBc.company,
        status: state,
        orderId,
      };
      await store.dispatch("updateOrderStatusOnBc", payloadStatusBc);
    },
    async updateOrderOnDb(date: Date, orderId: number, state: OrderStatusBc) {
      const payload = {
        deliveredAt: date,
        status: state,
        orderId,
      };

      await store.dispatch("updateOrderOnDb", payload);
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
  display: block;
  background: #1d1a1a;
  color: #666666;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 5000;
  top: 0;
  left: 0;
  float: none;
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
