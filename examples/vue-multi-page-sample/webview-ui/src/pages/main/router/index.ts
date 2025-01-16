import { type RouterOptions, createRouter, createWebHashHistory } from "vue-router";
import Mainbox from "../views/Mainbox.vue";

const routes: RouterOptions["routes"] = [
  {
    path: "/",
    redirect: "/mainbox",
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
