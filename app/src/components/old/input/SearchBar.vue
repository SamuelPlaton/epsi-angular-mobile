<template>
  <input
    class="border border-gray-light m-4 px-2 py-1 rounded-lg"
    v-model="searchString"
    v-model.lazy="searchString"
    id="site-search"
    name="q"
    :placeholder="placeholder"
  />
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    placeholder: String
  },
  data() {
    return {
      searchString: ""
    };
  },
  watch: {
    searchString() {
      this.$emit("changeString", this.searchString);
    }
  }
};
</script>

<style scoped></style>
