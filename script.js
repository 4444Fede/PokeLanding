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

async function getPokemonInformation(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching the api", error);
    });
}

async function setPokemonCards(pokemons) {
  const pokemonPromises = pokemons.results.map(async (element) => {
    await setPokemonCard(element.url, element.name);
  });

  // Esperamos a que todas las cartas se hayan creado
  await Promise.all(pokemonPromises);

  // Escondemos el overlay cuando todas las cartas se han creado
  hideLoading();
}

async function setPokemonCard(url, name) {
  let div = document.createElement("div");
  div.classList.add("pokemon-card");
  pokemonContainer.append(div);

  let pokemonData = await getPokemonInformation(url);

  let pokemonImg = document.createElement("img");
  pokemonImg.src = pokemonData.sprites.front_default;

  let pokemonName = document.createElement("h3");
  pokemonName.textContent = name[0].toUpperCase() + name.slice(1);

  let pokemonTypesContainer = setPokemonTypes(pokemonData);

  div.append(pokemonImg);
  div.append(pokemonName);
  div.append(pokemonTypesContainer);
}

function setPokemonTypes(pokemonData) {
  let pokemonTypesContainer = document.createElement("div");
  pokemonTypesContainer.classList.add("pokemon-types");

  getPokemonTypes(pokemonData).forEach(function (pokemonType) {
    let pokemonTypeElement = document.createElement("div");
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

  return pokemonTypesContainer;
}

function getPokemonTypes(pokemonData) {
  return pokemonData.types.map(function (type) {
    return type.type.name;
  });
}

async function fetchPokemons() {
  try {
    showLoading();
    const data = await getPokemonInformation(
      `${apiBaseUrl}?offset=${currentOffset}&limit=${limit}`
    );
    pokemonContainer.innerHTML = "";
    await setPokemonCards(data);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    hideLoading(); // En caso de error, ocultamos el overlay
  }
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
