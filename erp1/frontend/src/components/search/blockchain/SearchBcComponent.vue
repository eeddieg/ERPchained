<template>
  <div class="container my-4">
    <h2>Search in Blockchain</h2>
    <div class="container">
      <div class="card">
        <div class="container py-3" id="searchBc">
          <ul class="nav nav-pills justify-content-center">
            <li class="nav-item">
              <button
                id="customer-bc-tab"
                class="nav-link mx-2 active"
                data-bs-toggle="tab"
                data-bs-target="#customerBc"
                type="button"
                role="tab"
                aria-controls="customerBc"
                aria-selected="true"
                href="#"
              >
                Customers
              </button>
            </li>
            <li class="nav-item">
              <button
                id="order-bc-tab"
                class="nav-link mx-2"
                data-bs-toggle="tab"
                data-bs-target="#orderBc"
                type="button"
                role="tab"
                aria-controls="orderBc"
                aria-selected="false"
                href="#"
              >
                Orders
              </button>
            </li>
            <li class="nav-item">
              <button
                id="transaction-bc-tab"
                class="nav-link mx-2"
                data-bs-toggle="tab"
                data-bs-target="#transactionBc"
                type="button"
                role="tab"
                aria-controls="transactionBc"
                aria-selected="false"
                href="#"
              >
                Transactions
              </button>
            </li>
          </ul>
          <div class="card-body">
            <div class="tab-content" id="searchBc-tab-content">
              <div
                class="tab-pane fase show active"
                id="customerBc"
                role="tabpanel"
                aria-labelledby="customerBc-tab"
              >
                <CustomerBcSearch />
              </div>
              <div
                class="tab-pane fase show"
                id="orderBc"
                role="tabpanel"
                aria-labelledby="orderBc-tab"
              >
                <OrderBcSearch />
              </div>
              <div
                class="tab-pane fase show"
                id="transactionBc"
                role="tabpanel"
                aria-labelledby="transactionBc-tab"
              >
                <TransactionBcSearch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CustomerBcSearch from "./SearchBcCustomer.vue";
import OrderBcSearch from "./SearchBcOrder.vue";
import TransactionBcSearch from "./SearchBcTransactions.vue";

export default {
  name: "SearchBcComponent",
  components: {
    CustomerBcSearch,
    OrderBcSearch,
    TransactionBcSearch,
  },
};
</script>

<style scoped>
button {
  color: black;
}
</style>
