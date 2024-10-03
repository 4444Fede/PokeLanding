import { pokemonTypesStyles } from "./typesStyles.js";

const pokemonContainer = document.getElementById("pokemon-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const loadingOverlay = document.getElementById("loadingOverlay");
const apiBaseUrl = `https://pokeapi.co/api/v2/pokemon`;
let currentOffset = 0;
const limit = 25;

function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

async function fetchPokemons() {
  try {
    showLoading();
    const response = await fetch(
      `${apiBaseUrl}?offset=${currentOffset}&limit=${limit}`
    );
    const data = await response.json();
    const pokemons = data.results;

    pokemonContainer.innerHTML = "";

    for (let pokemon of pokemons) {
      const pokeData = await fetchPokemonData(pokemon.url);
      createPokemonCard(pokeData);
    }
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  } finally {
    hideLoading();
  }
}

async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    throw error;
  }
}

function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  const pokemonImage = document.createElement("img");
  pokemonImage.src = pokemon.sprites.front_default;

  const pokemonName = document.createElement("h3");
  pokemonName.textContent =
    pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

  const pokemonTypesContainer = document.createElement("div");
  pokemonTypesContainer.classList.add("pokemon-types");

  pokemon.types.forEach((typeInfo) => {
    const pokemonType = typeInfo.type.name;

    const pokemonTypeElement = document.createElement("div");
    pokemonTypeElement.classList.add("pokemon-type");

    const typeStyle = pokemonTypesStyles[pokemonType];
    pokemonTypeElement.style.backgroundColor = typeStyle.backgroundColor;

    const typeIcon = document.createElement("img");
    typeIcon.src = typeStyle.icon;
    typeIcon.alt = pokemonType;

    const typeName = document.createElement("p");
    typeName.textContent = pokemonType;

    pokemonTypeElement.appendChild(typeIcon);
    pokemonTypeElement.appendChild(typeName);
    pokemonTypesContainer.appendChild(pokemonTypeElement);
  });

  pokemonCard.appendChild(pokemonImage);
  pokemonCard.appendChild(pokemonName);
  pokemonCard.appendChild(pokemonTypesContainer);
  pokemonContainer.appendChild(pokemonCard);
}

function updateButtons() {
  prevButton.disabled = currentOffset === 0;
  nextButton.disabled = currentOffset + limit >= 1126;
}

prevButton.addEventListener("click", () => {
  if (currentOffset > 0) {
    currentOffset -= limit;
    fetchPokemons();
    updateButtons();
  }
});

nextButton.addEventListener("click", () => {
  currentOffset += limit;
  fetchPokemons();
  updateButtons();
});

window.addEventListener("load", function () {
  fetchPokemons();
  updateButtons();
});
