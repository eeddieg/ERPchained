<template>
  <div class="member">
    <h1>Welcome {{ user.firstName }}</h1>
  </div>
</template>

<script lang="ts">
import { User } from "../models/user.model";
import { useStore } from "vuex";

export default {
  name: "MemberComponent",
  setup() {
    const store = useStore();

    let user: User = store.getters.user;
    return {
      user,
    };
  },
};
</script>
