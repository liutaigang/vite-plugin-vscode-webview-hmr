import { type RouterOptions, createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Mainbox from "../views/Mainbox.vue";

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
  {
    path: "/mainbox",
    name: "mainbox",
    component: Mainbox,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
