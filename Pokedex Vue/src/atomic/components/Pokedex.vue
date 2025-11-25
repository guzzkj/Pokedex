<script setup>
// Imports do Vue
import { ref, computed, onMounted } from 'vue';
import { buscarPokemons, buscarPokemonPorNomeOuId } from '../../js/services/service.js';

// Imports dos Componentes (Átomos e Moléculas)
import PokemonCard from './PokemonCard.vue';
import SearchBar from './SearchBar.vue';

const listaPokemons = ref([]);
const pokemonSelecionado = ref(null);
const paginaAtual = ref(1);
const carregando = ref(false);
const totalPokemons = 1000;
const limitePorPagina = 32;

// --- LÓGICA (Reaproveitada da resposta anterior) ---
const carregarDados = async (termo = "") => {
  carregando.value = true;
  pokemonSelecionado.value = null; // Fecha detalhes ao buscar/paginar
  
  if (termo) {
     const dados = await buscarPokemonPorNomeOuId(termo);
     listaPokemons.value = dados ? [transformarPokemon(dados)] : [];
  } else {
     const offset = (paginaAtual.value - 1) * limitePorPagina;
     const listaSimples = await buscarPokemons(offset, limitePorPagina);
     const promessas = listaSimples.map(p => buscarPokemonPorNomeOuId(p.name));
     const detalhes = await Promise.all(promessas);
     listaPokemons.value = detalhes.map(transformarPokemon);
  }
  carregando.value = false;
};

const transformarPokemon = (d) => ({
  id: d.id, nome: d.name, imagem: d.sprites.front_default,
  tipos: d.types.map(t => t.type.name),
  stats: d.stats.map(s => ({ nome: s.stat.name, valor: s.base_stat }))
});

const paginas = computed(() => {
    return [paginaAtual.value, paginaAtual.value + 1].filter(p => p * limitePorPagina < totalPokemons);
});

// Ação vinda do SearchBar
const realizarBusca = (valor) => {
    paginaAtual.value = 1;
    carregarDados(valor);
};

onMounted(() => carregarDados());
</script>

<template>
  <main class="pokedex">
    <h1 class="titulo">Pokédex</h1>

    <SearchBar @buscar="realizarBusca" />

    <div class="conteudo">
      
      <aside v-if="pokemonSelecionado" class="detalhes">
         <h2>{{ pokemonSelecionado.nome }}</h2>
         <img :src="pokemonSelecionado.imagem" width="120">
         <h3>Status</h3>
         <ul>
           <li v-for="stat in pokemonSelecionado.stats" :key="stat.nome">
             {{ stat.nome }}: {{ stat.valor }}
           </li>
         </ul>
         <button @click="pokemonSelecionado = null" style="margin-top:10px; background:#333">Fechar</button>
      </aside>

      <div class="lista">
        <PokemonCard 
          v-for="poke in listaPokemons" 
          :key="poke.id" 
          :pokemon="poke"
          @selecionar="(p) => pokemonSelecionado = p"
        />
      </div>
    </div>

    <div class="paginacao">
       <button @click="paginaAtual--; carregarDados()" :disabled="paginaAtual === 1">Anterior</button>
       <span style="font-family: var(--fonte-pokemon)">Página {{ paginaAtual }}</span>
       <button @click="paginaAtual++; carregarDados()">Próxima</button>
    </div>
  </main>
</template>

<style>
/* Style.css*/
:root {
  --fonte-pokemon: "PKMN RBYGSC Regular", sans-serif;
}

body {
  font-family: var(--fonte-pokemon);
  background-color: #f6f8fc;
  margin: 0; padding: 0;
  text-align: center;
}

/* style.css e organism.css fundidos */
.titulo { color: #ff1c1c; font-size: 2rem; margin-bottom: 15px; }
.pokedex { padding: 20px; }

.conteudo {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
}

.lista {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 70%;
  margin: 0 auto;
}

.detalhes {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 350px;
  text-align: left;
}

.paginacao { margin-top: 20px; display: flex; justify-content: center; gap: 10px; }
.paginacao button { background-color: #ff1c1c; border: none; color: white; border-radius: 5px; padding: 6px 10px; cursor: pointer; }
</style>