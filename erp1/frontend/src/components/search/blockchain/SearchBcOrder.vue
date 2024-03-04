<template>
  <div class="container">
    <form class="g-3 needs-validation" novalidate @submit.prevent="submitForm">
      <h2 class="text-secondary">Search order in Blockchain by order ID</h2>
      <div class="row mb-3">
        <label for="inputOrderId" class="form-label col-sm-4">Order ID</label>
        <div class="col-sm-8">
          <input
            id="inputOrderId"
            type="number"
            class="form-control"
            placeholder="Enter order ID"
            v-model="orderId"
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
                <OrderResults :headers="headers" :order="this.order" />
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
import OrderResults from "../SearchOrderResultsTable.vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let orderResult: any;

export default {
  name: "OrderBcSearch",
  components: {
    OrderResults,
  },
  data() {
    return {
      orderId: null,
      isVisible: false,
      // order: null,
      order: {
        id: null,
        customerId: null,
        createdAt: null,
        deliveredAt: null,
        type: null,
        status: null,
        title: null,
        amount: null,
      },
    };
  },
  mounted() {
    // this.checkValidation();
    this.isVisible = false;
  },
  setup() {
    store = useStore();

    const headers = [
      "Order ID",
      "Customer ID",
      "Created At",
      "Delivered At",
      "Order Type",
      "Order Status",
      "Product",
      "Amount",
    ];

    orderResult = null;

    return {
      headers,
      orderResult,
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
    submitForm() {
      this.isVisible = false;
      if (this.orderId !== null) {
        this.fetchOrdersByOrderId(this.orderId);
        this.resetForm();
      } else {
        alert("Please enter Order ID");
      }
    },
    async fetchOrdersByOrderId(id: number) {
      this.orderResult = null;
      const order = await store.dispatch("getOrderByIdFromBc", id);

      if (order !== null) {
        this.order = order;
        this.isVisible = true;
      } else {
        alert(`Order could not be found with ID: ${id}`);
      }
    },
    resetForm() {
      this.orderId = null;
    },
  },
};
</script>

<style scoped></style>
