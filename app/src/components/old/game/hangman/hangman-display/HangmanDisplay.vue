<template>
  <div>
    <img
      class="w-48 h-48 my-2 flex mx-auto"
      alt="logo"
      :src="require('@/assets/hangman/hangman-' + lettersWrong.length + '.png')"
    />
  </div>
</template>

<script>
export default {
  name: "HangmanDisplay",
  props: {
    lettersWrong: Array
  }
};
</script>

<style scoped></style>
