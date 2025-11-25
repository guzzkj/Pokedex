<script setup>
import { ref, watch } from 'vue';

const termo = ref('');

const emit = defineEmits(['buscar']);

const acionarBusca = () => {
  emit('buscar', termo.value);
};

watch(termo, (novoValor) => {
    emit('buscar', novoValor); 
});
</script>

<template>
  <div class="busca">
    <input 
      type="text" 
      v-model="termo" 
      @keyup.enter="acionarBusca"
      placeholder="Buscar Pokémon por nome ou ID..." 
    />
    <button @click="acionarBusca">Buscar</button>
  </div>
</template>

<style scoped>
/* Conteúdo migrado de molecules.css */
.busca {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

input {
  padding: 8px;
  font-size: 10px;
  font-family: inherit; 
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 270px;
}

button {
  font-family: inherit;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background-color: #ff1c1c;
  color: white;
  cursor: pointer;
}
</style>