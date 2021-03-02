<template>
  <div class='w-full flex flex-col items-start border shadow-lg bg-gray-100 p-4' v-if="service && sector">
    <div class='flex justify-between items-center w-full'>
      <p class='text-lg'>{{ service.attributes.title }}</p>
      <p>{{ sector.attributes.title}}</p>
    </div>
    <p class='truncate'>{{ service.attributes.description }}</p>
    <p class='text-gray-500 text-sm'>{{ dateService }}</p>
  </div>
</template>

<script>
import {Service, Sector} from "../../../../entities";
import moment from "moment";

export default {
  name: "ServiceListItem.vue",
  props: {
    service: Service,
    sector: Sector
  },
  data() {
    return {
      dateService: moment(this.service.attributes.creationDate).format('L'),
    }
  }
};
</script>

<style scoped>

</style>