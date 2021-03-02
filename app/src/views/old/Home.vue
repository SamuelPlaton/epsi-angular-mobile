<template>
  <div class="home flex flex-col items-center">
    <img class="w-24 h-24 my-2" alt="logo" src="../assets/logo.png" />
    <p class="my-2 text-lg font-semibold">
      Welcome to my Vue.js application using REST Countries API
    </p>
    <p class="my-2">
      Here you can see for countries, detailed information about them and even
      some quiz !
    </p>
    <p class="my-2">
      See my other projects on my
      <a
        class="text-blue-600 hover:underline"
        href="https://github.com/SamuelPlaton"
      >
        Github
      </a>
    </p>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
