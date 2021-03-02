<template>
  <ul v-if="services">
    <li class="m-4" v-for="service in services"
        v-bind:key="service.id" @click="handleService(service)">
      <ServiceListItem :service="service" :sector="findSector(service)"/>
    </li>
  </ul>
</template>

<script>
import Vue from 'vue';
import ServiceListItem from './local-components/ServiceListItem';
import type {Service} from "@/entities";

export default Vue.extend({
  name: "ServiceList.vue",
  components: { ServiceListItem },
  props: {
    services: Array,
    sectors: Array,
  },
  methods:{
    handleService(service: Service){
      this.$router.push(`/ServiceDetail/${service.id}`)
    },
    findSector(service: Service){
      return this.sectors.find(s => s.id.toString() === service.relationships.sector);
    }
  }
})
</script>

<style scoped>

</style>