import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import dotenv from 'dotenv';
import "@/assets/css/tailwind.css";

Vue.config.productionTip = false;

// Allow us to use .env variables
dotenv.config();

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
