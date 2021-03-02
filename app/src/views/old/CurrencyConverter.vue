<template>
  <div class="flex flex-col items-start w-1/2 mx-auto">
    <p class="text-xl text-blue-500 font-semibold w-full text-center my-10">
      Welcome to my currency converter !
    </p>
    <div class="flex flex-row justify-between items-center w-full">
      <SelectInput
        class="my-4"
        label="Select Base : "
        name="base"
        @changeSelect="baseCoeff = $event"
        :options="currencies"
      />
      <SelectInput
        label="Select Converted : "
        name="converted"
        @changeSelect="convertedCoeff = $event"
        :options="currencies"
      />
    </div>
    <div class="flex flex-row justify-between items-center w-full">
      <input
        class="border border-gray-light w-24 px-2 py-1 rounded-lg"
        :onchange="convert()"
        type="number"
        v-model="base"
        min="0"
      />
      <p class="font-semibold text-xl">Result : {{ converted.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SelectInput from "@/components/input/SelectInput";

export default {
  name: "CurrencyConverter",
  components: { SelectInput },
  data() {
    return {
      currencies: [{ label: "EUR", value: 1.0 }],
      baseCoeff: false,
      convertedCoeff: false,
      base: 0,
      converted: 0
    };
  },
  methods: {
    convert() {
      // If a currency is missing, abort conversion
      if (!this.baseCoeff || !this.convertedCoeff) {
        return;
      }
      // Retrieve our coeff
      const coeff = this.convertedCoeff / this.baseCoeff;
      // Settle our converted value
      this.converted = this.base * coeff;
    }
  },
  async beforeCreate() {
    // Retrieve the countries name
    await axios.get("https://api.exchangeratesapi.io/latest").then(res => {
      for (const [key, value] of Object.entries(res.data.rates)) {
        // Retrieve currencies name and ratio depending on EUR
        this.currencies.push({ label: key, value: value });
      }
    });
  }
};
</script>

<style scoped></style>
