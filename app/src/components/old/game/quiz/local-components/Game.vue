<template>
  <div class="flex flex-col items-center">
    <img
      class="w-48 h-32 object-contain border border-black"
      :src="flag"
      alt="flag"
    />
    <div class="flex flex-row flex-wrap justify-between items-center">
      <button
        class="flex flex-wrap m-4 p-1 border bg-gray-200 hover:bg-green-200 rounded-lg"
        v-for="handledCountry in handledCountries"
        v-bind:key="handledCountry.name"
        @click="$emit('handleCountry', handledCountry)"
      >
        {{ handledCountry.name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Game",
  props: {
    flag: String,
    handledCountries: Array
  }
};
</script>

<style scoped></style>
