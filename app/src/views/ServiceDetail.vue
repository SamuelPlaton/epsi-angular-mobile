<template>
  <ServiceInfo :service="service" />
</template>

<script>
import axios from "axios";
import { ServiceInfo } from "@/components";

export default {
  name: "ServiceDetail",
  components: { ServiceInfo },
  data() {
    return {
      service: undefined
    };
  },
  async beforeCreate() {
      console.log("yooooooo");
    const service = this.$route.params.service;
    await axios

      .get("http://172.16.18.11:3001/services/" + service)
      .then(res => {
        this.service = res.data[0];
        console.log(this.service);
      });
  }
};
</script>

<style scoped></style>
