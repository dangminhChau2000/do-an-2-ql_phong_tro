import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import { API_APP } from "./api";

import RoutesHome from "@/views/home/services/routes";

const routes = [
  {
    path: "",
    name: "App",
    component: App,
    meta: {
      requiresAuth: true,
    },
    children: [...RoutesHome],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);

  if (to.name === "Login") {
    if (localStorage.getItem("token")) return next({ name: "Home" });
  } else {
    if (!localStorage.getItem("token")) return next({ name: "Login" });
  }

  next();
});

export default router;
