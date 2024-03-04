<template>
  <apexchart
    type="bar"
    height="260"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script lang="ts">
import { useStore } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any = null;
export default {
  name: "GroupedBarBc",
  props: ["auth"],
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          type: "bar",
          height: 260,
        },
        plotOptions: {
          title: {
            text: "Incoming and Outgoing Resources",
          },
          fill: {
            color: "",
          },
          bar: {
            horizontal: true,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: "9px",
            colors: ["#333300"],
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#fff"],
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        xaxis: {
          categories: [],
        },
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let res: any = null;
      try {
        res = await store.dispatch("getSplittedResourcesPerCustomerFromBc");
      } catch (error) {
        console.log("Actions.CALCULATE_NUMBER_OF_ORDERS_PER_CUSTOMER_FROM_BC");
        console.log(error);
      }

      if (res !== undefined) {
        const { customersName, incomingResourses, outgoingResourses } = res;

        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: customersName,
            },
          },
        };
        this.series = [
          {
            name: "Incoming resources",
            data: incomingResourses,
            color: "#228B22",
          },
          {
            name: "Outgoing resources",
            data: outgoingResourses,
            color: "#FF0000",
          },
        ];
      }
    },
    async init() {
      if (this.auth) {
        await this.renderChart();
      }
    },
  },
};
</script>
