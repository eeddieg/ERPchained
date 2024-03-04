<template>
  <div>
    <h5 class="my-1 py-0">Orders Per Customer</h5>
    <apexchart
      width="360"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any = null;

export default {
  name: "BarChart",
  props: ["auth"],
  data() {
    return {
      chartOptions: {
        chart: {
          id: "Orders per Customer",
        },
        xaxis: {
          categories: [],
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: true,
            hideOverlappingLabels: false,
          },
        },
        yaxis: {
          title: {
            text: "Number of Orders",
          },
        },
      },
      series: [
        {
          name: "Orders",
          data: [] as number[],
        },
      ],
    };
  },
  created() {
    this.init();
  },
  setup() {
    store = useStore();

    return {
      store,
    };
  },
  methods: {
    async renderChart() {
      const ordersPerCustomer = await store.dispatch(
        "calculateNumberOfOrdersPerCustomers"
      );

      const categories = Object.keys(ordersPerCustomer);
      const series = Object.values(ordersPerCustomer);

      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            categories: categories,
          },
        },
      };
      this.series = [
        {
          name: "Orders",
          data: series,
        },
      ];
    },
    async init() {
      // use this to access props
      if (this.auth) {
        await this.renderChart();
      }
    },
  },
};
</script>
