<template>
  <div class="container my-4">
    <h2>Search in Database</h2>
    <div class="container">
      <div class="card">
        <div class="container py-3" id="search">
          <ul class="nav nav-pills justify-content-center">
            <li class="nav-item">
              <button
                id="customer-tab"
                class="nav-link mx-2 active"
                data-bs-toggle="tab"
                data-bs-target="#customer"
                type="button"
                role="tab"
                aria-controls="customer"
                aria-selected="true"
                href="#"
              >
                Customers
              </button>
            </li>
            <li class="nav-item">
              <button
                id="order-tab"
                class="nav-link mx-2"
                data-bs-toggle="tab"
                data-bs-target="#order"
                type="button"
                role="tab"
                aria-controls="order"
                aria-selected="false"
                href="#"
              >
                Orders
              </button>
            </li>
          </ul>
          <div class="card-body">
            <div class="tab-content" id="search-tab-content">
              <div
                class="tab-pane fase show active"
                id="customer"
                role="tabpanel"
                aria-labelledby="customer-tab"
              >
                <CustomerDbSearch />
              </div>
              <div
                class="tab-pane fase show"
                id="order"
                role="tabpanel"
                aria-labelledby="order-tab"
              >
                <OrderDbSearch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CustomerDbSearch from "./SearchDbCustomer.vue";
import OrderDbSearch from "./SearchDbOrder.vue";

export default {
  name: "SearchDbComponent",
  components: {
    CustomerDbSearch,
    OrderDbSearch,
  },
};
</script>

<style scoped>
button {
  color: black;
}
</style>
