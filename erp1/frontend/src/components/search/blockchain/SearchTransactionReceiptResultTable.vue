<template>
  <div class="container">
    <div id="transaction-results">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <button
            id="raw-receipt-tab"
            class="nav-link mx-2 active"
            data-bs-toggle="tab"
            data-bs-target="#rawReceipt"
            type="button"
            role="tab"
            aria-controls="rawReceipt"
            aria-selected="true"
            href="#"
          >
            Raw Results
          </button>
        </li>
        <li class="nav-item">
          <button
            id="deserial-tab"
            class="nav-link mx-2"
            data-bs-toggle="tab"
            data-bs-target="#deserial"
            type="button"
            role="tab"
            aria-controls="deserial"
            aria-selected="false"
            href="#"
          >
            Deserialized Results
          </button>
        </li>
      </ul>
      <div class="tab-content" id="search-tab-content">
        <div
          class="tab-pane fase show active"
          id="rawReceipt"
          role="tabpanel"
          aria-labelledby="raw-receipt-tab"
        >
          <div class="col-sm-12">
            <div class="row">
              <h3 class="pt-4">Raw Receipt details</h3>
            </div>
            <div class="container">
              <table
                id="order-details-table"
                class="table table-sm table-striped table-bordered table-hover table-secondary"
              >
                <tr v-for="(header, i) in rawHeaders" :key="i">
                  <th class="col-3" style="text-align: left">
                    {{ header.toUpperCase() }}
                  </th>
                  <td class="col-8" style="text-align: left">
                    {{ rawReceipt[i] }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div
          class="tab-pane fase show"
          id="deserial"
          role="tabpanel"
          aria-labelledby="deserial-tab"
        >
          <div class="col-sm-12">
            <div class="row justify-content-center">
              <h3 class="pt-4 pb-2">Deserialized details</h3>
            </div>
            <div>
              <table
                id="order-details-table"
                class="table table-sm table-striped table-bordered table-hover table-secondary"
              >
                <tr v-for="(header, i) in orderHeaders" :key="i">
                  <th class="col-3" style="text-align: right">
                    {{ header.toUpperCase() }}
                  </th>
                  <td class="col-8">
                    {{ order[i] }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ReceiptResults",
  props: ["order", "orderHeaders", "rawHeaders", "rawReceipt"],
};
</script>

<style scoped>
button {
  color: black;
}
table th {
  text-align: center;
}
.table {
  justify-content: center;
  justify-self: center;
  margin: auto;
  margin-bottom: 50px;
  text-align: center;
  width: 100% !important;
}
#order-details-table {
  width: max-content;
}
</style>
