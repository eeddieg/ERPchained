<template>
  <div class="container">
    <h2>Statistics</h2>
    <div class="row my-5" v-show="isVisible">
      <h3>Data from Database</h3>
      <div class="row" id="dbData" v-show="isDbVisible">
        <div class="col-4">
          <div class="card">
            <div class="card-body">
              <BarChartDb :auth="auth" />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-body">
              <PieChartDb :auth="auth" />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-body">
              <GroupedBarDb :auth="auth" />
            </div>
          </div>
        </div>
      </div>
      <div class="row" id="bcData" v-show="isBcVisible">
        <hr class="hr my-3" />
        <h3>Data from Blockchain</h3>
        <div class="col-4">
          <div class="card">
            <div class="card-body">
              <BarChartBc :auth="auth" />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-body">
              <PieChartBc :auth="auth" />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-body">
              <GroupedBarBc :auth="auth" />
            </div>
          </div>
        </div>
        <hr class="hr my-3" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { Company } from "../../models/company.model";
import BarChartDb from "./database/BarChartDb.vue";
import BarChartBc from "./blockchain/BarChartBc.vue";
import GroupedBarDb from "./database/GroupedBarDb.vue";
import GroupedBarBc from "./blockchain/GroupedBarBc.vue";
import PieChartDb from "./database/PieChartDb.vue";
import PieChartBc from "./blockchain/PieChartBc.vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any = null;

export default {
  name: "StatisticsComponent",
  props: ["auth"],
  components: {
    BarChartDb,
    BarChartBc,
    GroupedBarDb,
    GroupedBarBc,
    PieChartDb,
    PieChartBc,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props: any) {
    let isBcVisible = false;
    let isDbVisible = false;
    let isVisible = false;

    if (props.auth) {
      store = useStore();
      const company = ref(store.getters.getCompany).value as Company;
      store.dispatch("enrollCompanyToBc", company);
      store.dispatch("updateCompanyInfoOnBc", company);

      store.dispatch("getSplittedResourcesPerCustomer");

      isBcVisible = ref(store.getters.isBcVisible).value;
      isDbVisible = ref(store.getters.isDbVisible).value;
      isVisible = ref(store.getters.isGridVisible).value;
    }

    return {
      isBcVisible,
      isDbVisible,
      isVisible,
      store,
    };
  },
};
</script>
