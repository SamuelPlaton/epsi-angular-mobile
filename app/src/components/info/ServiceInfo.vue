<template>
  <div>
    <div v-if="service" class="flex flex-row justify-around m-8">
      <div class="flex flex-col justify-between items-center">
        <!-- <img class="w-48 object-contain" :src="country.flag" alt="flag" /> -->
        <p class="text-2xl font-bold mt-2">{{ service.title }}</p>
      </div>
      <div class="flex flex-col justify-between text-left">
        <p>Titre : {{ service.title }}</p>
        <p>Description : {{ service.region }}</p>
        <p>Date de création : {{ service.creationDate }}</p>
        <p>
          <!-- Population :
          {{
            country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
          inhabitants
        </p>
        <p>
          Currency : {{ country.currencies[0].name }} ({{
            country.currencies[0].symbol
          }})
        </p> -->
      </div>
    </div>
    

    <div v-if="!service">
      <p class="font-semibold text-red-500">
        Error :Pas de service trouvé pour '{{ $route.params.service }}'
      </p>
    </div>
  </div>
</template>

<script>
import {Service} from "@/entities";
export default {
  name: "ServiceInfo",
  props: {
    service: Service
  }
};
</script>

<style scoped></style>
