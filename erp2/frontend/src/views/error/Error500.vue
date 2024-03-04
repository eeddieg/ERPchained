<template>
  <div
    class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
  >
    <!--begin::Content-->
    <div class="d-flex flex-column flex-column-fluid text-center p-10 py-lg-20">
      <!--begin::Wrapper-->
      <div class="pt-lg-10">
        <!--begin::Logo-->
        <h1 class="fw-bolder fs-4x text-gray-700 mb-10">System Error</h1>
        <!--end::Logo-->

        <!--begin::Message-->
        <div class="fw-bold fs-3 text-gray-400 mb-15">
          Something went wrong! <br />
          Please try again later.
        </div>
        <!--end::Message-->

        <!--begin::Action-->
        <div class="text-center">
          <a href="#" class="btn btn-lg btn-primary fw-bolder"
            >Go to homepage</a
          >
          <p class="text-muted m-5">or wait to be redirected shortly...</p>
        </div>
        <!--end::Action-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Content-->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import router from "../../router/index";

export default defineComponent({
  name: "error-500",
  setup() {
    onMounted(() => {
      setTimeout(() => {
        router.push("latest");
      }, 5000);
    });
  },
});
</script>
