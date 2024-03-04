<template>
  <div class="container">
    <form class="g-3 needs-validation" novalidate @submit.prevent="submitForm">
      <h2 class="text-secondary">
        Search for info on BLockchain by hash values
      </h2>
      <div class="row mb-3">
        <label for="inputOrderId" class="form-label col-sm-4">
          Transaction Hash
        </label>
        <div class="col-sm-8">
          <input
            id="inputOrderId"
            type="string"
            class="form-control"
            placeholder="Enter hash value"
            v-model="transactionHash"
          />
          <div class="valid-feedback">Looks good!</div>
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
    <div class="container my-3" v-show="isVisible">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="pt-4 col-sm-12">
              <div class="w-auto">
                <ReceiptResults
                  :rawHeaders="rawHeaders"
                  :rawReceipt="this.rawReceipt"
                  :orderHeaders="orderHeaders"
                  :order="this.order"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import ReceiptResults from "./SearchTransactionReceiptResultTable.vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;

export default {
  name: "OrderBcSearch",
  components: {
    ReceiptResults,
  },
  data() {
    return {
      isVisible: false,
      orderId: null,
      order: [],
      receipt: [],
      rawReceipt: [],
      transactionHash: "",
    };
  },
  mounted() {
    // this.checkValidation();
    this.isVisible = false;
  },
  setup() {
    store = useStore();

    const orderHeaders = [
      "order id",
      "customer id",
      "resource Id",
      "created At",
      "delivered At",
      "type",
      "status",
    ];

    const rawHeaders = [
      "accessList",
      "blockHash",
      "blockNumber",
      "chainId",
      "data",
      "from",
      "gasLimit",
      "gasPrice",
      "hash",
      "maxFeePerGas",
      "maxPriorityFeePerGas",
      "nonce",
      "signature",
      "type",
      "networkV",
      "r",
      "s",
      "v",
      "to",
      "type",
      "value",
      "_type",
    ];

    return {
      orderHeaders,
      rawHeaders,
      store,
    };
  },
  methods: {
    checkValidation() {
      const forms = document.querySelectorAll(".needs-validation");

      Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener(
          "submit",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event: any) => {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    async submitForm() {
      this.isVisible = false;
      if (this.transactionHash !== null) {
        await this.fetchBlockInfoByTransactionHash(this.transactionHash);
        await this.deserializeOrderTransaction(this.transactionHash);
        this.resetForm();
      } else {
        alert("Please enter a hash value");
      }
    },
    async deserializeOrderTransaction(hash: string) {
      const order = await store.dispatch("deserializeOrderTransaction", hash);
      if (order !== null) {
        this.populateOrderDetails(order);
      }
    },
    async fetchBlockInfoByTransactionHash(hash: string) {
      const receipt = await store.dispatch(
        "getOrderByTransactionHashFromBc",
        hash
      );

      if (receipt !== null) {
        this.rawReceipt = receipt;
        this.populateRawReceiptDetails(receipt);
        this.isVisible = true;
      } else {
        alert(`Block could not be found with transaction hash value: ${hash}`);
      }
    },
    async fetchBlockInfoByBlockNumber() {
      //
    },
    async fetchBlockInfoByHash() {
      //
    },
    async fetchBlockInfoByReceipt() {
      //
    },
    async fetchTransactionsByUserAddress() {
      //
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    populateOrderDetails(data: any) {
      this.order = [];
      this.order.push(data.id);
      this.order.push(data.customerId);
      this.order.push(data.resourceId);
      data.createdAt !== null
        ? this.order.push(new Date(data.createdAt).toUTCString())
        : this.order.push(data.createdAt);
      data.deliveredAt !== null
        ? this.order.push(new Date(data.deliveredAt).toUTCString())
        : this.order.push(data.deliveredAt);
      this.order.push(data.type);
      this.order.push(data.status);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    populateRawReceiptDetails(data: any) {
      this.rawReceipt = [];
      this.rawReceipt.push(data.accessList);
      this.rawReceipt.push(data.blockHash);
      this.rawReceipt.push(data.blockNumber);
      this.rawReceipt.push(data.chainId);
      this.rawReceipt.push(data.data);
      this.rawReceipt.push(data.from);
      this.rawReceipt.push(data.gasLimit);
      this.rawReceipt.push(data.gasPrice);
      this.rawReceipt.push(data.hash);
      this.rawReceipt.push(data.maxFeePerGas);
      this.rawReceipt.push(data.maxPriorityFeePerGas);
      this.rawReceipt.push(data.nonce);
      this.rawReceipt.push("");
      this.rawReceipt.push(data.signature._type);
      data.signature.networkV === null
        ? this.rawReceipt.push("Empty")
        : this.rawReceipt.push(data.signature.networkV);
      this.rawReceipt.push(data.signature.r);
      this.rawReceipt.push(data.signature.s);
      this.rawReceipt.push(data.signature.v);
      this.rawReceipt.push(data.to);
      this.rawReceipt.push(data.type);
      this.rawReceipt.push(data.value);
      this.rawReceipt.push(data._type);
    },
    resetForm() {
      this.transactionHash = null;
    },
  },
};
</script>

<style scoped></style>
