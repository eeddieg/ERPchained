<template>
  <div class="about">
    <div class="nav-bar">
      <NavBar :auth="auth" :role="role" />
    </div>
    <div class="pt-5">
      <h1>Tech stack</h1>
    </div>
    <div class="container">
      <div class="text-nowrap">
        <h2 class="pb-4">Webapp Full stack</h2>
        <div class="logos">
          <div class="hstack gap-3 d-inline-flex justify-content-center">
            <div class="border">
              <img id="vue" alt="Vue logo" src="../assets/logo.png" />
            </div>
            <div class="border">
              <img id="node" alt="Node logo" src="../assets/logos/node.png" />
            </div>
            <div class="border">
              <img id="ts" alt="TS logo" src="../assets/logos/ts.png" />
            </div>
            <img
              id="prisma"
              alt="Prisma logo"
              src="../assets/logos/prisma.png"
            />
            <div class="border">
              <img id="sql" alt="SQL logo" src="../assets/logos/sql.png" />
            </div>
          </div>
        </div>
      </div>
      <div id="separator" class="p-1 bg-dark text-dark"></div>
      <div class="container">
        <div class="mt-0 pt-5 text-nowrap">
          <h2 class="pb-4">Blockchain</h2>
          <div class="logos">
            <div class="hstack gap-3 d-inline-flex justify-content-center">
              <div class="border">
                <img
                  id="ganache"
                  alt="Ganache logo"
                  src="../assets/logos/ganache.png"
                />
              </div>
              <div class="border">
                <img
                  id="remixd"
                  alt="Remixd logo"
                  src="../assets/logos/remixd.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import NavBar from "../components/NavBar.vue";
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    NavBar,
  },
  data() {
    const store = useStore();
    const auth = ref(store.getters.isAuthenticated).value;
    const user = ref(store.getters.user).value;
    const role = user.role;

    return {
      auth,
      role,
    };
  },
};
</script>

<style scoped>
h1 {
  margin-left: 0%;
  padding-bottom: 50px;
}
.logos * {
  height: 150px;
  width: 250px;
  margin-left: 0%;
}
#separator {
  margin-top: 5%;
  margin-left: 0%;
}
img {
  margin-left: 10%;
  margin-right: 10%;
}
</style>
