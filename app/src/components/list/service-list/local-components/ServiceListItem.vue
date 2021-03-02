<template>
  <div class='w-full flex flex-col border shadow-lg bg-gray-200'>
    <div class='flex justify-between'>
      <p class='text-lg'>{{ service.attributes.title }}</p>
      <p class=>{{ sector.attributes.title }}</p>
    </div>
    <p class='text-gray-500 truncate'>{{ service.attributes.description }}</p>
    <p class='text-sm'>{{ dateService }}</p>
  </div>
</template>

<script>
import Api from "../../../../api/Api";
import { Service } from "../../../../entities";
import moment from "moment";

export default {
  name: "ServiceListItem.vue",
  props: {
    service: Object,
  },
  data() {
    return {
      sector: undefined,
      dateService: '',
    }
  },
  async beforeCreate() {
    this.applicant = Api.UsersApi.get(this.service.relationships.applicant);
    const sectors = Api.SectorsApi.get();
    this.sector = sectors.find(s => s.id === this.service.relationships.sector);
    this.dateService = moment(this.service.attributes.creationDate).format('L');
  }
};
</script>

<style scoped>

</style>