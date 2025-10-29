let paginaAtual = 1;
const limitePorPagina = 40;
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

function exibirPokemons(lista) {
  const container = document.getElementById("listaPokemons");
  container.innerHTML = "";
  lista.forEach(pokemon => {
    const card = document.createElement("div");
    card.classList.add("card-pokemon");
    card.innerHTML = `
      <img src="${pokemon.imagem}" alt="${pokemon.nome}">
      <h2>${pokemon.nome}</h2>
      <p><strong>Tipo:</strong> ${pokemon.tipos.join(", ")}</p>
    `;
    card.addEventListener("click", () => exibirDetalhes(pokemon));
    container.appendChild(card);
  });
}

function exibirDetalhes(pokemon) {
  const painel = document.getElementById("detalhesPokemon");
  painel.classList.remove("oculto");
  painel.innerHTML = `
    <h2>${pokemon.nome}</h2>
    <img src="${pokemon.imagem}" alt="${pokemon.nome}">
    <p><strong>ID:</strong> ${pokemon.id}</p>
    <p><strong>Tipo:</strong> ${pokemon.tipos.join(", ")}</p>
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

function atualizarPaginacao() {
  const numerosPaginas = document.getElementById("numerosPaginas");
  numerosPaginas.innerHTML = "";

  const totalPaginas = Math.ceil(totalPokemons / limitePorPagina);

  for (let i = 1; i <= totalPaginas && i <= 10; i++) {
    const botao = document.createElement("button");
    botao.textContent = i;
    botao.classList.toggle("ativo", i === paginaAtual);
    botao.addEventListener("click", () => {
      paginaAtual = i;
      carregarPokemons(paginaAtual);
    });
    numerosPaginas.appendChild(botao);
  }

  document.getElementById("anterior").onclick = () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      carregarPokemons(paginaAtual);
    }
  };

  document.getElementById("proximo").onclick = () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      carregarPokemons(paginaAtual);
    }
  };
}
