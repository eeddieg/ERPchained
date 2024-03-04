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
  Customer,
  OrderType,
  ProductBc,
  Receipt,
  Resource,
} from "../../models/order.model";
import { Company, CompanyBc } from "../../models/company.model";
import Swal from "sweetalert2";

const demoDuration = 1 * 60 * 1000; // minutes * seconds * miliseconds -> duration in ms
const freq = 15000; // order generation frequency in ms
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
    async calculateBuyersResources(company: Company) {
      let availableResources = 0;
      let reservedResources = 0;
      let idList = null;
      while (availableResources === 0) {
        const list = await this.fetchCustomerListFromBc(company.productToBuy);

        if (list.length > 0) {
          for (const index in list) {
            const company = list[index] as CompanyBc;
            const avResources = company.availableResources as number;
            const resResources = company.reservedResources as number;
            availableResources += avResources;
            reservedResources += resResources;
          }
        }

        idList = await this.calculateBcCustomerIdList(list);

        if (availableResources === 0) {
          console.log("Regenerating order. Please wait...");
        }
      }
      return { idList, availableResources, reservedResources };
    },
    async calculateBcCustomerIdList(list: CompanyBc[]) {
      let idList: number[] = [];

      if (list.length > 0) {
        for (const index in list) {
          const company = list[index] as CompanyBc;
          const email = company.email as string;
          const customer = (await store.dispatch(
            "getCustomerByEmail",
            email
          )) as Customer;
          const id = customer.id as number;
          idList.push(id);
        }
      }
      return idList.sort();
    },
    // Creates single order
    createOrder() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.generateRandomOrder().then((order: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        store.dispatch("createOrder", order).then((createdOrder: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          store.dispatch("enrollOrderToBc", createdOrder).then((res: any) => {
            if (res !== null && res !== undefined) {
              const receipt = {
                orderId: createdOrder.order.id as number,
                to: res.receipt.to as string | "",
                from: res.receipt.from as string | "",
                blockHash: res.receipt.blockHash as string | "",
                blockNumber: res.receipt.blockNumber as number | -1,
                status: res.receipt.status as number | -1,
                hash: res.receipt.hash as string | "",
              } as Receipt;

              store.dispatch("storeOrderReceipt", receipt);
              // console.log(receipt);
            }
          });
        });
      });
    },
    async createDemo() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let orderGenerated: any = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let orderCreated: any = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.generateRandomOrder().then((order: any) => {
        orderGenerated = order;
        if (orderGenerated !== null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          store.dispatch("createOrder", order).then((createdOrder: any) => {
            orderCreated = createdOrder;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            store.dispatch("enrollOrderToBc", orderCreated).then((res: any) => {
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
                    // return payload;
                  });
              }
              const emitData = {
                seller: orderCreated.customer.name as string,
                sellerEmail: orderCreated.customer.email as string,
                buyer: store.getters.getCompanyName as string,
                buyerEmail: store.getters.getCompany.email as string,
                buyerAddress: store.getters.user.address as string,
                amount: orderGenerated.amount as number,
                productBought: orderGenerated.title as string,
              };
              store.dispatch("informSeller", emitData);
            });
          });
        } else {
          return false;
        }
        return true;
      });
    },
    async fetchCustomerListFromBc(product: string) {
      // list of companies that SELL the product this company buys from BC
      return await this.store.dispatch("getSellersListFromBc", product);
    },
    async generateRandomOrder() {
      const minOrderAmount = 100;
      const maxOrderAmount = 1000;

      const company = store.getters.getCompany as Company;
      const productToBuy = company.productToBuy as ProductBc;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { idList, availableResources, _ } =
        await this.calculateBuyersResources(company);
      // const { idList, sum } = await this.calculateBuyersResources(company);
      const minCustId = idList[0];
      const maxCustId = idList[idList.length - 1];

      let amount = await utils.randomIntFromInterval(
        minOrderAmount,
        maxOrderAmount
      );

      if (availableResources < amount) {
        amount = availableResources;
      }

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
