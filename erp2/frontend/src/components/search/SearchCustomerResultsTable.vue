<template>
  <div class="container">
    <div class="container row">
      <div class="pt-4 col-sm-12">
        <div class="w-auto">
          <table
            id="search-results-table"
            class="table table-sm table-striped table-bordered table-hover table-secondary"
          >
            <thead>
              <th v-for="(header, i) in orderHeaders" :key="i" scope="col">
                {{ header.toUpperCase() }}
              </th>
            </thead>
            <tbody class="table-group-divider">
              <tr
                v-for="(order, i) in orders"
                :key="i"
                :id="`orders-table-${order}-${i}`"
              >
                <th class="col-2">{{ order.id }}</th>
                <td class="col-3">
                  {{ new Date(order.createdAt).toUTCString() }}
                </td>
                <td class="col-3">
                  {{ new Date(order.deliveredAt).toUTCString() }}
                </td>
                <td class="col-2">{{ order.type }}</td>
                <td class="col-2">{{ order.status }}</td>
                <td>{{ order.title }}</td>
                <td>{{ order.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SearchResultsTable",
  props: ["id", "orders", "orderHeaders"],
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
