import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: { auth: true },
    component: () =>
      import(/* webpackChunkName: "dashboard */ "@/views/DashboardView.vue"),
    beforeEnter(to, from, next) {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },
  {
    path: "/profile/company",
    name: "companyProfile",
    meta: { auth: true },
    component: () =>
      import(
        /* webpackChunkName: "companyProfile */ "@/views/ProfileCompanyView.vue"
      ),
    beforeEnter(to, from, next) {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },
  {
    path: "/profile/user",
    name: "userProfile",
    meta: { auth: true },
    component: () =>
      import(
        /* webpackChunkName: "userProfile */ "@/views/ProfileUserView.vue"
      ),
    beforeEnter(to, from, next) {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },
  {
    path: "/bcinfo",
    name: "bcinfo",
    meta: { auth: true },
    component: () =>
      import(/* webpackChunkName: "bcinfo */ "@/views/BlockchainView.vue"),
    beforeEnter(to, from, next) {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },
  {
    path: "/loginWith2FA",
    name: "loginWith2FA",
    meta: { auth: true },
    component: () =>
      import(
        /* webpackChunkName: "loginWith2FA */ "../components/login/LoginWith2FA.vue"
      ),
    beforeEnter(to, from, next) {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(
        /* webpackChunkName: "register" */ "../views/RegistrationView.vue"
      ),
  },
  {
    path: "/about",
    name: "about",
    meta: { auth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    redirect: () => {
      store.dispatch("logout").then((res: boolean) => {
        if (res) {
          return { name: "login" };
        }
      });
      return { name: "login" };
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.auth)) {
    const res = await store.dispatch("validateJwtToken");
    if (res !== 200) {
      await store.commit("setAuthenticatedStatus", false);
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
