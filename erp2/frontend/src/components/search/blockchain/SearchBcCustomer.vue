<template>
  <div class="container">
    <form
      id="form"
      class="g-3 needs-validation"
      novalidate
      @submit.prevent="submitForm"
    >
      <h2 class="text-secondary">Choose one of the fields below</h2>
      <div class="row mb-3">
        <label for="inputCustId" class="form-label col-sm-4">Customer ID</label>
        <div class="col-sm-8">
          <input
            id="inputCustId"
            type="number"
            class="form-control"
            placeholder="Enter customer ID"
            v-model="customerId"
          />
          <div class="valid-feedback">Looks good!</div>
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputCustEmail" class="form-label col-sm-4">Email</label>
        <div class="col-sm-8">
          <input
            id="inputCustEmail"
            type="email"
            class="form-control"
            placeholder="Enter customer email"
            v-model="email"
          />
          <div class="valid-feedback">Looks good!</div>
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
    <div class="container">
      <div v-show="isVisible">
        <SearchResultsTable
          :id="customerId"
          :order-headers="orderHeaders"
          :orders="orders"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import SearchResultsTable from "../SearchCustomerResultsTable.vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;

export default {
  name: "CustomerBcSearch",
  components: {
    SearchResultsTable,
  },
  data() {
    return {
      customerId: null,
      email: "",
      isVisible: false,
      orders: null,
    };
  },
  mounted() {
    // this.checkValidation();
    this.isVisible = false;
  },
  setup() {
    store = useStore();
    const orderHeaders = [
      "Order ID",
      "Created At",
      "Delivered At",
      "Order Type",
      "Order Status",
      "Product",
      "Amount",
    ];
    return {
      orderHeaders,
      store,
    };
  },
  methods: {
    checkEmailFormat(email: string) {
      const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i as RegExp;
      return expression.test(email) as boolean;
      // console.log("e-mail is " + (result ? "correct" : "incorrect"));
    },
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
      if (this.customerId !== null) {
        this.fetchOrdersByCustomerId(this.customerId);
        this.resetForm();
      } else if (this.email.length > 0) {
        const res = this.checkEmailFormat(this.email);

        if (!res) {
          alert("Email is incorrect");
        } else {
          this.fetchOrdersByCustomerEmail(this.email);
          this.resetForm();
        }
      } else {
        alert("Please enter Customer ID or email");
      }
    },
    async fetchOrdersByCustomerId(id: number) {
      this.email = "";
      this.orders = [];
      const orders = await store.dispatch("getOrdersByCustomerIdFromBc", id);

      if (orders !== null) {
        orders.sort();
        this.orders = orders;
        this.isVisible = true;
      } else {
        alert(`Customer could not be found with ID: ${id}`);
      }
    },
    async fetchOrdersByCustomerEmail(email: string) {
      this.customerId = null;
      this.orders = [];
      const orders = await store.dispatch(
        "getOrdersByCustomerEmailFromBc",
        email
      );

      if (orders !== null) {
        orders.sort();
        this.orders = orders;
        this.isVisible = true;
      } else {
        alert(`Customer could not be found with email: ${email}`);
      }
    },
    resetForm() {
      this.customerId = null;
      this.email = "";
    },
  },
};
</script>

<style scoped></style>
