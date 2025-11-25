// service.js
const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";

export async function buscarPokemons(offset = 0, limit = 40) {
  const resposta = await fetch(`${URL_BASE}?offset=${offset}&limit=${limit}`);
  const dados = await resposta.json();
  return dados.results;
}

export async function buscarPokemonPorNomeOuId(valor) {
  try {
    const resposta = await fetch(`${URL_BASE}${valor.toLowerCase()}`);
    if (!resposta.ok) return null;
    return await resposta.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}