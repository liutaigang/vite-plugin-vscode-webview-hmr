import { createApp } from "vue";
// elementplus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router).use(ElementPlus).mount("#sign");
