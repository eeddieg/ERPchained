<template>
  <div class="row">
    <div class="pt-4 col-sm-12">
      <div class="w-auto">
        <table
          id="orderDb-results-table"
          class="table table-sm table-striped table-bordered table-hover table-secondary"
        >
          <thead>
            <th v-for="(header, i) in headers" :key="i" scope="col">
              {{ header.toUpperCase() }}
            </th>
          </thead>
          <tbody class="table-group-divider">
            <th class="col">{{ order.id }}</th>
            <th class="col">{{ order.customerId }}</th>
            <td class="col-3">
              {{ new Date(order.createdAt).toUTCString() }}
            </td>
            <td class="col-3">
              {{ new Date(order.deliveredAt).toUTCString() }}
            </td>
            <td class="col-2">{{ order.type }}</td>
            <td class="col-3">{{ order.status }}</td>
            <td class="col-2">{{ order.title }}</td>
            <td>{{ order.amount }}</td>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "OrderResults",
  props: ["order", "headers"],
};
</script>

<style scoped>
table th {
  text-align: center;
}
.table {
  justify-content: center;
  justify-self: center;
  margin: auto;
  text-align: center;
  width: 100% !important;
}
</style>
