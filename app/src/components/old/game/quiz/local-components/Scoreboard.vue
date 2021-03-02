<template>
  <div class="w-full flex flex-row justify-around">
    <p class="m-1 font-semibold">Score : {{ score }}</p>
    <p class="m-1 font-semibold">Best : {{ bestScore }}</p>
  </div>
</template>

<script>
export default {
  name: "Scoreboard",
  props: {
    score: Number,
    bestScore: Number
  }
};
</script>

<style scoped></style>
