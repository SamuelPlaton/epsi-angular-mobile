<template>
  <div>
    <label class="mr-2" :for="name">{{ label }}</label>
    <select
      class="border border-gray-300 rounded-lg p-1"
      :name="name"
      :id="name"
      v-model="optionSelected"
      @change="$emit('changeSelect', optionSelected)"
    >
      <option
        v-for="option in options"
        :value="option.value"
        v-bind:key="option.label"
        >{{ option.label }}</option
      >
    </select>
  </div>
</template>

<script>
export default {
  name: "SelectInput",
  data() {
    return {
      optionSelected: ""
    };
  },
  props: {
    label: String,
    name: String,
    options: Array
  }
};
</script>

<style scoped></style>
