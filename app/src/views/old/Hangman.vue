<template>
  <div>
    <HangmanDisplay :letters-wrong="lettersWrong" :user-answer="userAnswer" />
    <p>{{ userAnswer.toString().replaceAll(",", "") }}</p>
    <LetterInput
      v-if="lettersWrong.length < 5 && !win"
      :letters-right="lettersRight"
      :letters-wrong="lettersWrong"
      @inputLetter="handleLetter($event)"
    />
    <GameOver
      v-if="lettersWrong.length === 5 || win"
      @restart="play"
      :win="win"
    />
  </div>
</template>

<script>
import axios from "axios";
import LetterInput from "@/components/input/LetterInput";
import GameOver from "@/components/game/game-over/GameOver";
import HangmanDisplay from "@/components/game/hangman/hangman-display/HangmanDisplay";

export default {
  name: "Hangman",
  components: { HangmanDisplay, GameOver, LetterInput },
  data() {
    return {
      countries: [],
      selectedCountry: [],
      lettersRight: [],
      lettersWrong: [],
      userAnswer: [],
      win: false
    };
  },
  methods: {
    play() {
      // Reset our previous data
      this.lettersWrong = [];
      this.lettersRight = [];
      this.win = false;
      // Randomly pick a country
      this.selectedCountry = this.countries[
        Math.floor(Math.random() * this.countries.length)
      ].name
        .toLowerCase()
        .split("");
      // Display answer in console for tests
      console.log(this.selectedCountry.join(""));
      // Settle a user answer
      this.userAnswer = this.selectedCountry.map(item => {
        return item === " " ? " " : "_";
      });
    },
    handleLetter(letter) {
      // Handle if a letter is correct or wrong
      if (this.selectedCountry.includes(letter)) {
        this.lettersRight.push(letter);
        this.selectedCountry.map((item, index) => {
          if (item === letter) {
            this.userAnswer[index] = item;
            this.win = !this.userAnswer.includes("_");
          }
        });
      } else {
        this.lettersWrong.push(letter);
      }
    }
  },
  async beforeCreate() {
    // Retrieve the countries name
    await axios
      .get("https://restcountries.eu/rest/v2/all?fields=name")
      .then(res => {
        this.countries = res.data;
      });
    // Then start the game
    this.play();
  }
};
</script>

<style scoped></style>
