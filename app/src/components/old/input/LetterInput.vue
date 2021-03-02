<template>
  <div class="flex flex-col items-center mx-auto w-1/2 lg:w-1/4">
    <input
      class="w-full border border-gray-light m-4 px-2 py-1 rounded-lg"
      v-model="inputLetter"
      v-model.lazy="inputLetter"
      id="site-search"
      name="q"
      placeholder="_"
      autocomplete="off"
    />
    <div class="flex flex-col items-start text-left w-full">
      <p class="text-green-500">Right Letters : {{ lettersRight.join(" ") }}</p>
      <p class="text-red-500">Wrong Letters : {{ lettersWrong.join(" ") }}</p>
      <p class="text-blue-500" v-if="warningMsg">
        This letter has already been proposed ...
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LetterInput",
  props: {
    lettersRight: Array,
    lettersWrong: Array
  },
  data() {
    return {
      inputLetter: "",
      warningMsg: false
    };
  },
  watch: {
    inputLetter() {
      // retrieve our letter then instantly reset it
      const letter = this.inputLetter.toLowerCase();
      this.inputLetter = "";
      // We cancel only if we receive a valid character
      if (letter === " " || letter.length === 0) {
        return;
      }

      // Warning user and cancel treatment if the letter has already been selected
      if (
        this.lettersRight.includes(letter) ||
        this.lettersWrong.includes(letter)
      ) {
        this.warningMsg = true;
        return;
      }

      // Emit our result
      this.warningMsg = false;
      this.$emit("inputLetter", letter);
    }
  }
};
</script>

<style scoped></style>
