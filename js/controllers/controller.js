let paginaAtual = 1;
const limitePorPagina = 32;
let totalPokemons = 0;
let pokemonsCache = [];

async function carregarPokemons(pagina = 1) {
  const offset = (pagina - 1) * limitePorPagina;
  const dados = await buscarPokemons(offset, limitePorPagina);
  totalPokemons = 1000;

  pokemonsCache = [];
  for (const poke of dados) {
    const detalhes = await buscarPokemonPorNomeOuId(poke.name);
    const pokemon = new Pokemon(
      detalhes.name,
      detalhes.sprites.front_default,
      detalhes.types.map(t => t.type.name),
      detalhes.stats.map(s => ({ nome: s.stat.name, valor: s.base_stat })),
      detalhes.id
    );
    pokemonsCache.push(pokemon);
  }

  exibirPokemons(pokemonsCache);
  atualizarPaginacao();
}

const coresTipos = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

// Função para criar badges de tipo
function criarBadgesTipos(tipos) {
  return tipos.map(tipo => {
    const cor = coresTipos[tipo];
    return `<span class="badge-tipo" style="background-color:${cor}">${tipo}</span>`;
  }).join(" ");
}

// Formatação de ID para estilo Pokemon "1" -> "0001"
function formatarId(id) {
  return String(id).padStart(4, "0");
}


function exibirPokemons(lista) {
  const container = document.getElementById("listaPokemons");
  container.innerHTML = "";

  lista.forEach(pokemon => {
    const card = document.createElement("div");
    card.classList.add("card-pokemon");
    const idFormatado = formatarId(pokemon.id);

    card.innerHTML = `
      <span class="pokemon-id">#${idFormatado}</span>
      <img src="${pokemon.imagem}" alt="${pokemon.nome}">
      <h2>${pokemon.nome}</h2>
      <p>${criarBadgesTipos(pokemon.tipos)}</p>
    `;
    card.addEventListener("click", () => exibirDetalhes(pokemon));
    container.appendChild(card);
  });
}

// Atualizando exibição dos detalhes
function exibirDetalhes(pokemon) {
  const painel = document.getElementById("detalhesPokemon");
  painel.classList.remove("oculto");
  const idFormatado = formatarId(pokemon.id);

  painel.innerHTML = `
    <h2>${pokemon.nome}</h2>
    <img src="${pokemon.imagem}" alt="${pokemon.nome}">
    <p>#${idFormatado}</p>
    <p>${criarBadgesTipos(pokemon.tipos)}</p>
    <h3>Status</h3>
    <ul>
      ${pokemon.stats.map(s => `<li>${s.nome}: ${s.valor}</li>`).join("")}
    </ul>
  `;
}

async function buscarPokemonPorInput(valor) {
  const listaPokemons = document.getElementById("listaPokemons");
  if (!valor) {
    return carregarPokemons(paginaAtual);
  }

  const dados = await buscarPokemonPorNomeOuId(valor);
  listaPokemons.innerHTML = "";

  if (dados) {
    const pokemon = new Pokemon(
      dados.name,
      dados.sprites.front_default,
      dados.types.map(t => t.type.name),
      dados.stats.map(s => ({ nome: s.stat.name, valor: s.base_stat })),
      dados.id
    );
    exibirPokemons([pokemon]);
  } else {
    listaPokemons.innerHTML = "<p>Pokémon não encontrado!</p>";
  }
}



// Paginação/Navegação
function atualizarPaginacao() {
  const numerosPaginas = document.getElementById("numerosPaginas");
  numerosPaginas.innerHTML = "";

  const totalPaginas = Math.ceil(totalPokemons / limitePorPagina);

  // Calcular intervalo de páginas visíveis (até 5)
  let inicio = Math.max(1, paginaAtual - 2);
  let fim = Math.min(totalPaginas, paginaAtual + 2);

  if (paginaAtual <= 3) fim = Math.min(5, totalPaginas);
  if (paginaAtual >= totalPaginas - 2) inicio = Math.max(totalPaginas - 4, 1);

  // Botão "Primeira"
  if (inicio > 1) {
    const btn = document.createElement("button");
    btn.textContent = "1";
    btn.onclick = () => { paginaAtual = 1; carregarPokemons(paginaAtual); };
    numerosPaginas.appendChild(btn);
    if (inicio > 2) {
      numerosPaginas.appendChild(document.createTextNode(" ... "));
    }
  }

  // Botões das páginas
  for (let i = inicio; i <= fim; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === paginaAtual) btn.classList.add("ativo");
    btn.onclick = () => { paginaAtual = i; carregarPokemons(paginaAtual); };
    numerosPaginas.appendChild(btn);
  }

  // Botão "Última"
  if (fim < totalPaginas) {
    if (fim < totalPaginas - 1) {
      numerosPaginas.appendChild(document.createTextNode(" ... "));
    }
    const btn = document.createElement("button");
    btn.textContent = totalPaginas;
    btn.onclick = () => { paginaAtual = totalPaginas; carregarPokemons(paginaAtual); };
    numerosPaginas.appendChild(btn);
  }



}
