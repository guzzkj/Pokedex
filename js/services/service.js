const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";

async function buscarPokemons(offset = 0, limit = 40) {
  const resposta = await fetch(`${URL_BASE}?offset=${offset}&limit=${limit}`);
  const dados = await resposta.json();
  return dados.results;
}

async function buscarPokemonPorNomeOuId(valor) {
  const resposta = await fetch(`${URL_BASE}${valor.toLowerCase()}`);
  if (!resposta.ok) return null;
  const dados = await resposta.json();
  return dados;
}
