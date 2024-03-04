<template>
  <div class="container">
    <h2>DLP module</h2>
    <div class="container mt-3">
      <div class="container mb-4">
        <button class="btn btn-primary" @click="retrieveAll">Retrieve</button>
      </div>
      <div class="container" v-show="isVisible">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="pt-4 col-sm-12">
                <div class="w-auto">
                  <div class="mb-5">
                    <h2 class="text-dark">{{ companyName }}</h2>
                    <h3 class="text-secondary">{{ message }}</h3>
                    <h4 class="text-secondary">
                      Number of Customers registered on Blockchain:
                      <strong class="text-danger">{{ custNumber }}</strong>
                    </h4>
                  </div>
                  <div class="container">
                    <div
                      v-for="(customer, i) in result"
                      :key="i"
                      scope="row"
                      class="my-5 py-4"
                    >
                      <div class="row">
                        <h3 class="text-secondary">
                          History of customer {{ customer.name }}
                        </h3>
                        <table
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
                          <tbody class="table-group-divider">
                            <td class="col">{{ customer.id }}</td>
                            <td class="col">{{ customer.name }}</td>
                            <td class="col">{{ customer.email }}</td>
                            <td class="col">{{ customer.company }}</td>
                          </tbody>
                        </table>
                      </div>
                      <div class="container">
                        <table
                          class="table table-sm table-striped table-bordered table-hover table-secondary"
                        >
                          <thead>
                            <th
                              v-for="(header, j) in orderHeaders"
                              :key="j"
                              scope="col"
                            >
                              {{ header.toUpperCase() }}
                            </th>
                          </thead>
                          <tbody class="table-group-divider">
                            <tr
                              v-for="(order, k) in customer.orders"
                              :key="k"
                              scope="col"
                            >
                              <td class="col">{{ order.id }}</td>
                              <td class="col">{{ order.customerId }}</td>
                              <td class="col-2">{{ order.title }}</td>
                              <td class="col">{{ order.amount }}</td>
                              <td class="col-2">
                                {{ new Date(order.createdAt).toUTCString() }}
                              </td>
                              <td class="col-2">
                                {{ new Date(order.deliveredAt).toUTCString() }}
                              </td>
                              <td class="col-2">{{ order.type }}</td>
                              <td class="col-2">{{ order.status }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any = null;

export default {
  name: "DlpComponent",
  data() {
    return {
      companyName: "",
      custNumber: 0,
      message: "",
      isVisible: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result: [] as any[],
    };
  },
  created() {
    store = useStore();
    this.companyName = store.getters.getCompanyName;

    this.isVisible = false;
  },
  setup() {
    const customerHeaders = ["id", "name", "email", "company"];
    const orderHeaders = [
      "order id",
      "customer Id",
      "title",
      "amount",
      "createdAt",
      "deliveredAt",
      "type",
      "status",
    ];
    return {
      customerHeaders,
      orderHeaders,
      store,
    };
  },
  methods: {
    async retrieveAll() {
      this.result = [];
      const data = await store.dispatch("retrieveAll");

      this.message = data.message;
      this.result = data.result;
      this.custNumber = this.result.length;
      this.isVisible = true;
    },
  },
};
</script>

<style scoped></style>
