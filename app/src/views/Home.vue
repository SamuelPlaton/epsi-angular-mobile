<template>
  <div>
    <service-list :services="services" :sectors="sectors"/>
  </div>
</template>

<script>
import Api from "../api/Api";
import {ServiceList} from "../components/list";

export default {
  name: "Home",
  components: {ServiceList},
  data() {
    return {
      services: [],
      sectors: [],
    };
  },
  async beforeCreate() {
    this.sectors = await Api.SectorsApi.get();
    this.services = await Api.ServicesApi.recommended(["1", "2", "4", "5", "6"], "47.208642, -1.546095", 100);
  }
};
</script>
