import { pokemonTypesStyles } from "./typesStyles.js";

const pokemonContainer = document.getElementById("pokemon-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const loadingOverlay = document.getElementById("loading-overlay");
const searchButton = document.getElementById("search-button");
const searchInput = document.querySelector(".search-input");
const numberPage = document.getElementById("number-page");
const emptyState = document.getElementById("empty-state");
const mainContainer = document.querySelector("main");

const apiBaseUrl = `https://pokeapi.co/api/v2/pokemon`;
const limit = 25;
let currentOffset = 0;
let filteredResults = [];
let totalPages = 0;
let isSearchMode = false;

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
  await Promise.all(pokemonPromises);
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
    typeName.textContent = pokemonType[0].toUpperCase() + pokemonType.slice(1);

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
    hideLoading();
    updatePageNumber();
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    hideLoading();
  }
}

async function searchPokemons(query) {
  try {
    showLoading();
    const data = await getPokemonInformation(
      `${apiBaseUrl}?offset=0&limit=1302`
    );

    filteredResults = data.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );

    totalPages = Math.ceil(filteredResults.length / limit);
    currentOffset = 0;
    isSearchMode = true;
    showCurrentPage();
    hideLoading();
    updatePageNumber();
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    hideLoading();
  }
}

function showEmptyState() {
  emptyState.classList.remove("hidden");
  mainContainer.classList.add("hidden");
}

function hideEmptyState() {
  emptyState.classList.add("hidden");
  mainContainer.classList.remove("hidden");
}

function showCurrentPage() {
  if (filteredResults.length === 0) {
    showEmptyState();
    return;
  }
  hideEmptyState();
  showLoading();
  pokemonContainer.innerHTML = "";
  const start = currentOffset;
  const end = currentOffset + limit;
  const pokemonsToShow = filteredResults.slice(start, end);

  const pokemonPromises = pokemonsToShow.map(async (pokemon) => {
    await setPokemonCard(pokemon.url, pokemon.name);
  });
  Promise.all(pokemonPromises).then(() => hideLoading());
  updateButtons();
}

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  handleSearch(query);
  scrollToTop();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    handleSearch(query);
    scrollToTop();
  }
});

function handleSearch(query) {
  if (query) {
    searchPokemons(query);
  } else {
    resetSearch();
  }
}

function resetSearch() {
  isSearchMode = false;
  currentOffset = 0;
  hideEmptyState();
  fetchPokemons();
  updateButtons();
  updatePageNumber();
}

function updateButtons() {
  if (isSearchMode) {
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = currentOffset + limit >= filteredResults.length;
  } else {
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = currentOffset + limit >= 1302;
  }
}

function updatePageNumber() {
  const currentPage = Math.floor(currentOffset / limit) + 1;
  numberPage.textContent = currentPage;
}

prevButton.addEventListener("click", () => {
  if (currentOffset > 0) {
    currentOffset -= limit;
    handlePage();
  }
});

nextButton.addEventListener("click", () => {
  currentOffset += limit;
  handlePage();
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}

function handlePage() {
  if (isSearchMode) {
    showCurrentPage();
  } else {
    fetchPokemons();
  }
  scrollToTop();
  updateButtons();
  updatePageNumber();
}
window.addEventListener("load", function () {
  fetchPokemons();
  scrollToTop();
  updateButtons();
  updatePageNumber();
});
