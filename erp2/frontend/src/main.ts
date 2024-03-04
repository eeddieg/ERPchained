import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import VueApexCharts from "vue3-apexcharts";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App)
  .use(VueSweetalert2)
  .use(VueApexCharts)
  .use(store)
  .use(router)
  .mount("#app");
