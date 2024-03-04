<template>
  <apexchart
    type="pie"
    width="400"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script lang="ts">
import { useStore } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any = null;

export default {
  name: "PieChart",
  props: ["auth"],
  data() {
    return {
      series: [] as number[],
      chartOptions: {
        chart: {
          width: 400,
          type: "pie",
        },
        labels: [] as string[],
        title: {
          text: "Orders Percentage by Customer",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
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
      // console.log(ordersPerCustomer);
      const categories = Object.keys(ordersPerCustomer);
      const series = Object.values(ordersPerCustomer);

      this.chartOptions = {
        ...this.chartOptions,
        ...{
          labels: categories,
        },
      };
      this.series = series;
    },
    async init() {
      if (this.auth) {
        await this.renderChart();
      }
    },
  },
};
</script>
