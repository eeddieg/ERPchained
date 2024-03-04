<template>
  <div class="container">
    <div class="container mt-4">
      <button class="btn btn-primary" @click="fetchCustomers">
        Fetch Customers
      </button>
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
        <div class="container row" v-show="isCustomerListVisible">
          <div class="container">
            <CompanyTable :data="companyData" />
          </div>
          <div class="pt-2 col-sm-12">
            <div class="container row pt-1 pb-4 justify-content-center">
              <h3 class="col-sm-2">Customers</h3>
              <div class="col-sm-2">
                <button class="btn btn-secondary" @click="hideTable()">
                  Hide
                </button>
              </div>
            </div>
            <div class="container w-auto">
              <table
                id="customer-table"
                class="table table-sm table-striped table-bordered table-hover table-secondary"
              >
                <thead>
                  <th
                    v-for="(header, i) in customerHeaders"
                    :key="i"
                    scope="col"
                  >
                    {{ header.toUpperCase() }}
                  </th>
                </thead>
                <tbody class="table-group-divider text-break text-wrap">
                  <tr v-for="(customer, i) in customerList" :key="i">
                    <th>{{ customer.id }}</th>
                    <td>
                      <a href="#" @click="fetchOrderByCustomer(customer)">
                        {{ customer.name }}
                      </a>
                    </td>
                    <td id="cust-email">{{ customer.email }}</td>
                    <td id="cust-address">{{ customer.address }}</td>
                    <th class="text-success">{{ customer.incoming }}</th>
                    <th class="text-danger">{{ customer.outgoing }}</th>
                  </tr>
                </tbody>
              </table>
              <i>Click on the name to view the orders of that customer</i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-4" id="table-2">
      <div v-show="isOrderListVisible">
        <div class="container row" v-show="isOrderListVisible">
          <OrdersTable
            :title="currCustomer"
            :orderListHeaders="orderHeaders"
            :orderList="orderList"
            :isOrderListFetched="isOrderListVisible"
            @hide-order-table="resetOrderVisibility"
            @order-requested="populateDetails"
          />
        </div>
      </div>
    </div>
    <div class="container mt-4" id="table-3">
      <div v-show="isDetailListVisible">
        <div class="container row" v-show="isDetailListVisible">
          <OrderDetails
            :order="orderRequested"
            :receipt="receiptRequested"
            @hide-order-details-table="resetDetailsVisibility"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import { useStore } from "vuex";
import { User } from "../../models/user.model";
import { Customer, Order, Receipt } from "../../models/order.model";
import CompanyTable from "./TableCompany.vue";
import OrdersTable from "./TableOrderComponent.vue";
import OrderDetails from "./TableOrderDetails.vue";
import { Company, CompanyBc } from "../../models/company.model";
import dotenv from "dotenv";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let customerList: any[];
let orderList: Order[];
// const freq = 15000; // Time in (ms) to call API for updated Company resources
// const orderFreq = 15000; // Time in (ms) to call API for updated Company resources
const resourcesFreq = 5000; // Time in (ms) to call API for updated Company resources

const customerHeaders = [
  "Id",
  "Name",
  "Email",
  "Address",
  "Incoming",
  "Outgoing",
];
const orderHeaders = [
  "Id",
  "Date created",
  "Date Delivered",
  "Order Type",
  "Status",
];

let currCustomer = "";

export default {
  name: "CustomerTable",
  components: {
    CompanyTable,
    OrdersTable,
    OrderDetails,
  },
  data() {
    return {
      bcCustomers: [],
      dbCustomers: [],
      interval: null,
      isCustomerListVisible: false,
      isDetailListVisible: false,
      isOrderListVisible: false,
      isProgressVisible: false,
      isSpinnerVisible: false,
      message: "",
      companyData: [],
      orderRequested: [],
      receiptRequested: {},
      resourcesLoopInterval: null,
    };
  },
  created() {
    // this.loop();
    this.resourcesLoop();
  },
  beforeUnmount() {
    clearInterval(this.interval);
    clearInterval(this.receiveOrderLoopInterval);
    clearInterval(this.resourcesLoopInterval);
  },
  setup() {
    dotenv.config();
    store = useStore();
    const user: User = reactive(store.getters.user);

    return {
      currCustomer,
      customerHeaders,
      customerList,
      orderHeaders,
      orderList,
      user,
    };
  },
  watch: {
    companyData: {
      deep: true,
      immediate: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      handler(newValue: any[], oldValue: any[]) {
        // console.log(oldValue);
        // console.log(newValue);
      },
    },
  },
  methods: {
    async calculateCompanyResources() {
      const { availableResources, reservedResources } =
        await this.fetchCompanyResourcesFromDb();

      await this.setCompTotalResourcesOnBc(
        availableResources,
        reservedResources
      );
      const updatedCompany: Company = await store.dispatch(
        "fetchCompanyFromBc"
      );

      const isAuth = store.getters.isAuthenticated;
      if (isAuth) {
        this.populateCompanyData(updatedCompany);
      }

      return updatedCompany;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async checkDbRegistrationStatus(list: any[]) {
      this.dbCustomers = [];
      let status = true;

      this.dbCustomers = await store.dispatch("getCustomers");

      for (const indexA in this.dbCustomers) {
        const cust = this.dbCustomers[indexA];
        for (const indexB in list) {
          const comp = list[indexB];
          if (cust.name === comp.companyName) {
            status = false;
            break;
          }
        }
      }
      return status;
    },
    disableProgressBar() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isProgressVisible = false;
      overlay.style.display = "none";
    },
    enableProgressBar() {
      const overlay = document.getElementById("overlay") as HTMLInputElement;
      this.isProgressVisible = true;
      overlay.style.display = "block";
    },
    async fetchCompanyResourcesFromDb() {
      const list = this.customerList;
      const temp: Customer[] = [];

      for (const index in list) {
        const cust = list[index];
        const resources = await this.fetchTotalResourcesPerCustomer(cust.id);
        cust.incoming = resources.inResources;
        cust.outgoing = resources.outResources;
        temp.push(cust);
      }

      const { inbound, outbound } = this.sumCompanyResources(temp);
      const availableResources = (inbound - outbound) as number;
      const reservedResources = outbound as number;
      return { availableResources, reservedResources };
    },
    async fetchCustomers() {
      // Fetch customers from BC, check if are stored in DB
      await this.fetchSellersFromBc();
      await this.fetchCustomersFromDb();

      await store.commit("setBcStatsVisibility", true);
      await store.commit("setDbStatsVisibility", true);
      await store.commit("setStatisticsVisibility", true);
    },
    async fetchCustomersFromDb() {
      const list = await store.dispatch("getCustomers");
      const temp = [];
      this.resetDetailsVisibility();
      this.resetOrderVisibility();
      this.enableProgressBar();
      for (let cust of list) {
        const customerId = cust.id as number;
        this.message = `Registering Customer #${customerId} on Blockchain`;
        this.updateProgressBar(0);
        const resources = await this.fetchTotalResourcesPerCustomer(cust.id);
        this.updateProgressBar(30);
        cust.incoming = resources.inResources;
        cust.outgoing = resources.outResources;
        temp.push(cust);
        this.updateProgressBar(55);
        await store.dispatch("enrollCustomerToBc", cust);
        this.updateProgressBar(85);
        this.updateProgressBar(100);
      }
      this.customerList = temp;
      this.disableProgressBar();
      this.isCustomerListVisible = true;
    },
    async fetchSellersFromBc() {
      const company = store.getters.getCompany as Company;
      // list of companies that SELL the product this company buys from BC
      const listToBuy = await store.dispatch(
        "getSellersListFromBc",
        company.productToBuy
      );

      if (listToBuy.length > 0) {
        const status = await this.checkDbRegistrationStatus(listToBuy);
        if (status) {
          console.log(
            `Found ${listToBuy.length} new customer(s) from Blockchain.`
          );
          // alert(`Found ${listToBuy.length} new customer(s) from Blockchain.`);
          // store companies found on BC as customers
          for (const index in listToBuy) {
            const company = listToBuy[index] as CompanyBc;
            const payload = {
              name: company.companyName as string,
              email: company.email as string,
              address: company.address as string,
              product: company.productToSell as string,
              amount: company.reservedResources as number,
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await store.dispatch("storeCustomerToDb", payload);
          }
        }
      }
    },
    async fetchTotalResourcesPerCustomer(id: number) {
      return await store.dispatch("getResourcesByCustomerId", id);
    },
    async fetchOrderById(id: number) {
      this.isOrderDetailsRequested = false;
      this.currOrder = id;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await store.dispatch("getOrderById", id).then((res: any) => {
        this.orderRequested = res;
        this.isOrderDetailsRequested = true;
      });
    },
    async fetchOrderByCustomer(customer: Customer) {
      this.resetOrderVisibility();
      this.resetDetailsVisibility();

      this.currCustomer = customer.name;
      const email = customer.email;
      this.orderList = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await store.dispatch("getOrdersByCustomer", email).then((res: any) => {
        const orders = res.orders;
        const customer = res.customer;
        this.orderList = orders;
        this.isOrderListVisible = true;

        // Register orders on BC
        this.registerOrderOnBlockchain(customer, orders);
      });
    },
    hideTable() {
      this.isCustomerListVisible = false;
    },
    resourcesLoop() {
      this.resourcesLoopInterval = setInterval(() => {
        this.calculateCompanyResources();
      }, resourcesFreq);
    },
    populateCompanyData(data: Company) {
      this.companyData = [];

      let length = 0;
      this.customerList === undefined
        ? length
        : (length = this.customerList.length);

      this.companyData.push(store.getters.getCompanyName);
      this.companyData.push(length);
      this.companyData.push(data.productToBuy);
      this.companyData.push(data.availableResources);
      this.companyData.push(data.productToSell);
      this.companyData.push(data.reservedResources);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    populateDetails(data: any) {
      this.isDetailListVisible = false;
      this.orderRequested = [];

      this.orderRequested.push(data.orderId);
      this.orderRequested.push(data.customerId);
      this.orderRequested.push(data.receiptId);
      this.orderRequested.push(data.product);
      this.orderRequested.push(data.amount);
      this.orderRequested.push(data.createdAt);
      this.orderRequested.push(data.deliveredAt);
      this.orderRequested.push(data.orderType);
      this.orderRequested.push(data.orderStatus);
      data.bcStatus === 1
        ? this.orderRequested.push("Registered on blockchain")
        : this.orderRequested.push("Not registered on blockchain yet");
      this.orderRequested.push(data.sendTo);
      this.orderRequested.push(data.receivedFrom);
      this.orderRequested.push(data.blockHash);
      this.orderRequested.push(data.blockNumber);
      this.orderRequested.push(data.transaction);

      this.isDetailListVisible = true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async registerOrderOnBlockchain(customer: Customer, orders: any) {
      for (const order of orders) {
        this.message = `Registering Order #${order.id} on Blockchain`;
        this.enableProgressBar();
        this.updateProgressBar(0);
        const payload = {
          customer,
          order,
        };

        this.updateProgressBar(30);
        const res = await store.dispatch("enrollOrderToBc", payload);

        this.updateProgressBar(65);

        if (res.receipt !== null && res.receipt !== undefined) {
          const receipt = {
            orderId: order.id as number,
            to: res.receipt.to as string | "",
            from: res.receipt.from as string | "",
            blockHash: res.receipt.blockHash as string | "",
            blockNumber: res.receipt.blockNumber as number | -1,
            status: res.receipt.status as number | -1,
            hash: res.receipt.hash as string | "",
          } as Receipt;

          this.message = `Indexing Order #${order.id} on local database`;
          this.updateProgressBar(80);
          await store.dispatch("storeOrderReceipt", receipt);
        }
      }
      this.updateProgressBar(100);
      this.disableProgressBar();
      this.message = "";
    },
    resetDetailsVisibility() {
      this.isDetailListVisible = false;
    },
    resetOrderVisibility() {
      this.isOrderListVisible = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async setCompTotalResourcesOnBc(inbound: number, outbound: number) {
      const payload = {
        inbound,
        outbound,
      };

      await store.dispatch("setCompanyResourcesOnBc", payload);
      // return await store.dispatch("fetchCompanyFromBc");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sumCompanyResources(list: any) {
      let inbound = 0;
      let outbound = 0;
      for (const cust of list) {
        inbound += cust.incoming;
        outbound += cust.outgoing;
      }

      return { inbound, outbound };
    },
    updateProgressBar(value: number) {
      const pbar = document.getElementById("progress-bar") as HTMLInputElement;
      const progress = String(value) + "%";
      pbar.style.width = progress;
      pbar.innerText = progress;
    },
  },
};
</script>

<style scoped>
table th {
  text-align: center;
}
.table {
  margin: auto;
  width: 100% !important;
}
#customer-table {
  width: 90% !important;
  text-align: center;
  justify-content: center;
  justify-self: center;
}
#cust-address {
  color: blue;
  font-size: x-small;
}
#cust-email {
  font-size: small;
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
