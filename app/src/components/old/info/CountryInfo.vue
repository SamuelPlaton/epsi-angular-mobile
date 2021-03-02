<template>
  <div>
    <div v-if="country" class="flex flex-row justify-around m-8">
      <div class="flex flex-col justify-between items-center">
        <img class="w-48 object-contain" :src="country.flag" alt="flag" />
        <p class="text-2xl font-bold mt-2">{{ country.name }}</p>
      </div>
      <div class="flex flex-col justify-between text-left">
        <p>Capital : {{ country.capital }}</p>
        <p>Region : {{ country.region }}</p>
        <p>SubRegion : {{ country.subregion }}</p>
        <p>
          Population :
          {{
            country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
          inhabitants
        </p>
        <p>
          Currency : {{ country.currencies[0].name }} ({{
            country.currencies[0].symbol
          }})
        </p>
      </div>
    </div>

    <div v-if="!country">
      <p class="font-semibold text-red-500">
        Error : no country found for '{{ $route.params.country }}'
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CountryInfo",
  props: {
    country: Object | undefined
  }
};
</script>

<style scoped></style>
