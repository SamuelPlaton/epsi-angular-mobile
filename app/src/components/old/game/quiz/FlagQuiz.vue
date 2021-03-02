<template>
  <div class="flex flex-col items-center">
    <Scoreboard :score="score" :best-score="parseInt(bestScore)" />
    <Game
      v-if="!gameOver"
      :flag="answer.flag"
      :handled-countries="handledCountries"
      @handleCountry="handleClick($event)"
    />
    <GameOver v-if="gameOver" @restart="gameOver = false" :win="false" />
  </div>
</template>

<script>
import axios from "axios";
import Scoreboard from "./local-components/Scoreboard";
import Game from "./local-components/Game";
import GameOver from "@/components/game/game-over/GameOver";

export default {
  name: "FlagQuiz",
  components: { GameOver, Game, Scoreboard },
  data() {
    return {
      countries: [],
      score: 0,
      bestScore: 0,
      handledCountries: [],
      answer: "",
      gameOver: false
    };
  },
  methods: {
    pickCountries() {
      // Reset handled countries
      this.handledCountries = [];
      // Random index of the right answer
      let answerIndex = Math.floor(Math.random() * 4);
      // Fullfill our array with 4 countries
      for (let i = 0; i < 4; i++) {
        let index = Math.floor(Math.random() * this.countries.length);
        // If country is already picked, we restart
        while (this.handledCountries.includes(this.countries[index])) {
          index = Math.floor(Math.random() * this.countries.length);
        }
        // Define our answer
        if (i === answerIndex) {
          this.answer = this.countries[index];
        }
        // Add our country
        this.handledCountries.push(this.countries[index]);
      }
      // Display answer in console for tests
      console.log(this.answer.name);
    },
    handleClick(handledCountry) {
      // Handle anwser
      // If correct answer, increment score
      if (handledCountry.name === this.answer.name) {
        this.score += 1;
      } else {
        // If wrong answer, reset score to 0 and change bestScore if needed
        if (this.score > (localStorage.pbFlag ?? this.bestScore)) {
          this.bestScore = this.score;
          localStorage.pbFlag = this.score;
        }
        this.score = 0;
        this.gameOver = true;
      }
      // Redo a round
      this.pickCountries();
    }
  },
  async beforeCreate() {
    await axios
      .get("https://restcountries.eu/rest/v2/all?fields=name;flag")
      .then(res => {
        this.countries = res.data;
      });
    // Retrieve bestStore from the store
    if (localStorage.pbFlag) {
      this.bestScore = localStorage.pbFlag;
    }
    this.pickCountries();
  }
};
</script>

<style scoped></style>
