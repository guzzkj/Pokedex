document.addEventListener("DOMContentLoaded", () => {
  const botaoBuscar = document.getElementById("botaoBuscar");
  const campoBusca = document.getElementById("campoBusca");

  botaoBuscar.addEventListener("click", () => {
    buscarPokemonPorInput(campoBusca.value.trim());
  });

  campoBusca.addEventListener("input", () => {
    if (campoBusca.value.trim() === "") {
      carregarPokemons(paginaAtual);
    }
  });

  carregarPokemons();
});
