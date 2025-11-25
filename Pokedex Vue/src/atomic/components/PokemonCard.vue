<script setup>
const props = defineProps({
  pokemon: Object,
});

const formatarId = (id) => String(id).padStart(4, "0");

const coresTipos = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD"
};
</script>

<template>
  <div class="card-pokemon" @click="$emit('selecionar', pokemon)">
    <span class="pokemon-id">#{{ formatarId(pokemon.id) }}</span>
    <img :src="pokemon.imagem" :alt="pokemon.nome">
    <h2>{{ pokemon.nome }}</h2>
    
    <div>
      <span 
        v-for="tipo in pokemon.tipos" 
        :key="tipo"
        class="badge-tipo"
        :style="{ backgroundColor: coresTipos[tipo] }"
      >
        {{ tipo }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Conteudo migrado de atoms.css */
.card-pokemon {
  position: relative;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
  display: flex; /* Ajuste para centralizar */
  flex-direction: column;
  align-items: center;
}

.card-pokemon:hover { transform: scale(1.05); }

.card-pokemon img { width: 96px; height: 96px; }

.card-pokemon h2 {
  margin: 8px 0 5px 0;
  text-transform: capitalize;
  font-size: 1rem;
}

.pokemon-id {
  position: absolute;
  top: 5px; left: 5px;
  color: #333;
}

.badge-tipo {
  display: inline-block;
  padding: 4px 8px;
  margin: 2px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  text-transform: capitalize;
}
</style>