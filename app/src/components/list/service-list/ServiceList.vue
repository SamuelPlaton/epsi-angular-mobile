<template>
  <ul>
    <li v-for="service in services"
        v-bind:key="service.id" @click="handleService(service)">
      <ServiceListItem :service="service"/>
    </li>
  </ul>
</template>

<script>
import Vue from 'vue';
import ServiceListItem from './local-components/ServiceListItem';

export default Vue.extend({
  name: "ServiceList.vue",
  components: { ServiceListItem },
  props: {
    service: Array
  },
  methods:{
    handleService(service){
      console.log(service);
    }
  }
})
</script>

<style scoped>

</style>