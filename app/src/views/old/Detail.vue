<template>
  <CountryInfo :country="country" />
</template>

<script>
import axios from "axios";
import { CountryInfo } from "@/components";

export default {
  name: "Detail",
  components: { CountryInfo },
  data() {
    return {
      country: undefined
    };
  },
  async beforeCreate() {
    const country = this.$route.params.country;
    await axios
      .get("https://restcountries.eu/rest/v2/name/" + country)
      .then(res => {
        this.country = res.data[0];
        console.log(this.country);
      });
  }
};
</script>

<style scoped></style>
