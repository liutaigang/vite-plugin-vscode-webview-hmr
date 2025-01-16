import { type RouterOptions, createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";

const routes: RouterOptions["routes"] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
