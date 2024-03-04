<template>
  <div class="container">
    <div>
      <h2>Flow</h2>
      <button class="btn btn-success mx-2" @click="startDemo">
        Start Demo
      </button>
      <button class="btn btn-danger mx-2" @click="stopDemo">Stop Demo</button>
    </div>
    <div class="container mt-4" id="table-orders">
      <div v-show="isOrderListVisible">
        <GeneratedOrders
          ref="generatedOrdersRef"
          :orderListHeaders="orderHeaders"
          :orderList="orderList"
          :isVisible="isOrderListVisible"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { Utils } from "../../utils/helper.utils";
import GeneratedOrders from "../tables/TableGeneratedOrders.vue";
import {
  OrderType,
  ProductBc,
  Receipt,
  Resource,
} from "../../models/order.model";
import { Company } from "../../models/company.model";
import Swal from "sweetalert2";

const demoDuration = 1 * 60 * 1000; // minutes * seconds * miliseconds -> duration in ms
const freq = 12000; // createOrder interval in ms - NEEDS TO BE HARDCODED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let utils: any;
// let isUpdateBtnEnabled: boolean;

const orderHeaders = [
  "Orer ID",
  "Amount",
  "Title",
  "Created At",
  "Delivered At",
  "Order Type",
  "Order Status",
  "Block Number",
  "Block Hash",
  "Transaction Hash",
  "Update Order",
];

export default {
  name: "TransactionFlow",
  components: {
    GeneratedOrders,
  },
  data() {
    return {
      duration: null,
      interval: null,
      isOrderListVisible: false,
      orderList: [],
    };
  },
  setup() {
    store = useStore();
    utils = new Utils();

    return {
      orderHeaders,
      store,
      utils,
    };
  },
  methods: {
    async createDemo() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.generateRandomOrder().then((order: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        store.dispatch("createOrder", order).then((createdOrder: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          store.dispatch("enrollOrderToBc", createdOrder).then((res: any) => {
            if (res.receipt !== null && res.receipt !== undefined) {
              const receipt = {
                orderId: createdOrder.order.id as number,
                to: res.receipt.to as string,
                from: res.receipt.from as string,
                blockHash: res.receipt.blockHash as string,
                blockNumber: res.receipt.blockNumber as number,
                status: res.receipt.status as number,
                hash: res.receipt.hash as string,
              } as Receipt;
              store.dispatch("storeOrderReceipt", receipt);
              store
                .dispatch("getResourcesByOrderId", createdOrder.order.id)
                .then((resources: Resource) => {
                  const payload = {
                    id: createdOrder.order.id as number,
                    amount: resources.amount as number,
                    title: resources.title,
                    createdAt: new Date(
                      createdOrder.order.createdAt
                    ).toUTCString(),
                    deliveredAt:
                      createdOrder.order.deliveredAt === null
                        ? "Pending"
                        : new Date(
                            createdOrder.order.deliveredAt
                          ).toUTCString(),
                    type: createdOrder.order.type,
                    status: createdOrder.order.status,
                    blockHash: res.receipt.blockHash as string,
                    blockNumber: res.receipt.blockNumber as number,
                    hash: res.receipt.hash as string,
                  };
                  this.orderList.push(payload);
                  return payload;
                });
            }
          });
        });
      });
    },
    async generateRandomOrder() {
      const minCustId = 1001;
      const maxCustId = 1005;
      const minOrderAmount = 100;
      const maxOrderAmount = 1000;
      // const minOrderStatus = 0;
      // const maxOrderStatus = 1;
      // const minOrderType = 0;
      // const maxOrderType = 1;

      const company = store.getters.getCompany as Company;
      const productToBuy = company.productToBuy as ProductBc;
      // const product = await utils.randomIntFromInterval(
      //   minOrderStatus,
      //   maxOrderStatus
      // );
      // const type = await utils.randomIntFromInterval(
      //   minOrderType,
      //   maxOrderType
      // );

      const amount = await utils.randomIntFromInterval(
        minOrderAmount,
        maxOrderAmount
      );

      console.log(`Placed order has ${amount} units of ${productToBuy}`);

      const order = {
        customerId: await utils.randomIntFromInterval(minCustId, maxCustId),
        createdAt: new Date().valueOf(),
        deliveredAt: null,
        type: OrderType[0],
        status: "PLACED",
        title: productToBuy as ProductBc,
        amount,
      };
      return order;
    },
    async startDemo() {
      console.log("Start");
      this.triggerToast("Order creation started");
      this.isOrderListVisible = true;
      this.$refs.generatedOrdersRef.setUpdateBtnVisibility(false);

      this.interval = setInterval(() => {
        console.log("Creating order...");
        this.createDemo();
        console.log("Done\n");
      }, freq);

      this.duration = setInterval(() => {
        this.stopDemo();
      }, demoDuration);
    },
    stopDemo() {
      console.log("Stop");
      // this.isOrderListVisible = false;
      clearInterval(this.duration);
      clearInterval(this.interval);

      // this.$refs.generatedOrdersRef.setUpdateBtnVisibility(true);
      setTimeout(() => {
        this.$refs.generatedOrdersRef.setUpdateBtnVisibility(true);
      }, freq);
      this.triggerToast("Order creation stopped");
    },
    triggerToast(msg: string) {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        showCancelButton: false,
        timer: 3000,
        icon: "success",
        title: "Order Generation Demo",
        text: msg,
      });
    },
  },
};
</script>

<style scoped></style>
