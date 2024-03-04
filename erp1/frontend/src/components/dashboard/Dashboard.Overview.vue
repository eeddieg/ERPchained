<template>
  <div class="container">
    <h2>Overview</h2>
    <div class="container mt-5">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <button
            id="overview-tab"
            class="nav-link active"
            data-bs-toggle="tab"
            data-bs-target="#overview"
            type="button"
            role="tab"
            aria-controls="overview"
            aria-selected="true"
            href="#"
          >
            Overview
          </button>
        </li>
        <li class="nav-item">
          <button
            id="transaction-tab"
            class="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#transaction"
            type="button"
            role="tab"
            aria-controls="transaction"
            aria-selected="false"
            href="#"
          >
            Transactions
          </button>
        </li>
        <li class="nav-item">
          <button
            id="search-tab"
            class="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#search"
            type="button"
            role="tab"
            aria-controls="search"
            aria-selected="false"
            href="#"
          >
            Search
          </button>
        </li>
        <li class="nav-item" v-show="user.role === UserRole.ADMIN">
          <button
            id="dlp-tab"
            class="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#dlp"
            type="button"
            role="tab"
            aria-controls="dlp"
            aria-selected="false"
            href="#"
          >
            DLP
          </button>
        </li>
      </ul>
      <div class="tab-content" id="dashboard-tab-content">
        <div
          class="tab-pane fase show active"
          id="overview"
          role="tabpanel"
          aria-labelledby="overview-tab"
        >
          <CustomerTable />
        </div>
        <div
          class="tab-pane fase show"
          id="transaction"
          role="tabpanel"
          aria-labelledby="transaction-tab"
        >
          <div class="container py-4">
            <TransactionOverview />
          </div>
        </div>
        <div
          class="tab-pane fase show"
          id="search"
          role="tabpanel"
          aria-labelledby="search-tab"
        >
          <div class="container py-4">
            <SearchOverviewVue />
          </div>
        </div>
        <div
          class="tab-pane fase show"
          id="dlp"
          role="tabpanel"
          aria-labelledby="dlp-tab"
        >
          <div class="container py-4">
            <DlpComponent />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import { useStore } from "vuex";
import CustomerTable from "../tables/TableCustomers.vue";
import DlpComponent from "../dlp/DlpComponent.vue";
import TransactionOverview from "../transactions/TransactionOverview.vue";
import SearchOverviewVue from "../search/SearchOverview.vue";
import { User, UserRole } from "../../models/user.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;

export default {
  name: "DashboardOverview",
  components: {
    CustomerTable,
    DlpComponent,
    SearchOverviewVue,
    TransactionOverview,
  },
  setup() {
    store = useStore();
    const user: User = reactive(store.getters.user);

    // company = ref(store.getters.getCompany).value as Company;
    // store.dispatch("enrollCompanyToBc", company);
    // store.dispatch("updateCompanyInfoOnBc", company);
    return {
      user,
      UserRole,
    };
  },
};
</script>

<style scoped>
button {
  color: black;
}
</style>
