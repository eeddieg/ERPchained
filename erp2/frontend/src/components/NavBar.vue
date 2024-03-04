<template>
  <div class="">
    <div v-if="!auth">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#" id="brand">ERP-chained-II</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link to="/" class="nav-link active" aria-current="page">
                  Home
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/login" class="nav-link" aria-current="page">
                  Login
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  to="/register"
                  class="nav-link"
                  aria-current="page"
                >
                  Register
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <div v-else>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#" id="brand">ERP-chained</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link
                  :to="{ name: 'home' }"
                  class="nav-link"
                  aria-current="page"
                  >Home</router-link
                >
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'dashboard' }"
                  class="nav-link"
                  aria-current="page"
                >
                  Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'bcinfo' }"
                  class="nav-link"
                  aria-current="page"
                  >Blockchain Info</router-link
                >
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'companyProfile' }"
                  class="nav-link"
                  aria-current="page"
                  v-show="role === adminRole"
                  >Company Info</router-link
                >
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'userProfile' }"
                  class="nav-link"
                  aria-current="page"
                  >User Profile Info</router-link
                >
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'about' }"
                  class="nav-link"
                  aria-current="page"
                  >About</router-link
                >
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'logout' }"
                  class="nav-link"
                  aria-current="page"
                  >Logout</router-link
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { UserRole } from "../models/user.model";

export default {
  props: {
    auth: Boolean,
    role: String,
  },
  data() {
    return {
      adminRole: UserRole.ADMIN,
    };
  },
};
</script>

<style scoped>
#brand {
  font-weight: 900;
}
li {
  font-weight: 550;
}
</style>
