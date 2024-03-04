<template>
  <div class="container my-4">
    <h2>Company overview</h2>
    <div class="container w-75">
      <div class="col-sm-12">
        <table
          class="table table-sm table-striped table-bordered table-hover table-secondary"
        >
          <th
            v-for="(header, i) in companyHeaders"
            :key="i"
            scope="col"
            id="headers"
          >
            {{ header }}
          </th>
          <tbody class="table-group-divider text-break text-wrap">
            <th class="text-break nowrap">{{ data[0] }}</th>
            <th class="text-info">{{ data[1] }}</th>
            <th class="text-secondary">{{ data[2] }}</th>
            <th class="text-success">{{ data[3] }}</th>
            <th class="text-secondary">{{ data[4] }}</th>
            <th class="text-danger">{{ data[5] }}</th>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const companyHeaders = [
  "Company Brand",
  "Total Customers",
  "Inbound Product",
  "Inbound Quantity",
  "Outbound Product",
  "Outbound Quantity",
];
export default {
  name: "CompanyTable",
  props: ["data"],
  data() {
    return {
      companyHeaders,
    };
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
table th {
  text-align: center;
  overflow-wrap: normal;
}
table {
  font-size: small;
  justify-content: center;
  justify-self: center;
  margin: auto;
  width: 100% !important;
  text-align: center;
}
</style>
