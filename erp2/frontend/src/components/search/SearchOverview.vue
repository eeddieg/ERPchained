<template>
  <div class="container">
    <div class="container py-3" id="search">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <button
            id="searchDb-tab"
            class="nav-link mx-2 active"
            data-bs-toggle="tab"
            data-bs-target="#searchDb"
            type="button"
            role="tab"
            aria-controls="searchDb"
            aria-selected="true"
            href="#"
          >
            Database Search
          </button>
        </li>
        <li class="nav-item">
          <button
            id="searchBc-tab"
            class="nav-link mx-2"
            data-bs-toggle="tab"
            data-bs-target="#searchBc"
            type="button"
            role="tab"
            aria-controls="searchBc"
            aria-selected="false"
            href="#"
          >
            Blockchain Search
          </button>
        </li>
      </ul>
      <div class="tab-content" id="search-tab-content">
        <div
          class="tab-pane fase show active"
          id="searchDb"
          role="tabpanel"
          aria-labelledby="searchDb-tab"
        >
          <SearchDb />
        </div>
        <div
          class="tab-pane fase show"
          id="searchBc"
          role="tabpanel"
          aria-labelledby="searchBc-tab"
        >
          <SearcBc />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SearchDb from "./database/SearchDbComponent.vue";
import SearcBc from "./blockchain/SearchBcComponent.vue";

export default {
  name: "SearchOverview",
  components: {
    SearchDb,
    SearcBc,
  },
};
</script>

<style scoped>
button {
  color: black;
}
</style>
