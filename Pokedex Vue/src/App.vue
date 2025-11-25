<script setup>
import Pokedex from './atomic/components/Pokedex.vue';
</script>

<template>
  <Pokedex />
</template>

<style>
:root {
  --fonte-pokemon: "PKMN RBYGSC Regular", sans-serif;
}

body {
  font-family: var(--fonte-pokemon);
  background-color: #f6f8fc;
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>