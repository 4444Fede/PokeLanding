import {pokemonTypesStyles} from "./typesStyles.js"

const pokemonContainer = document.getElementById("pokemon-container");
const apiEndpointWithLimit = `https://pokeapi.co/api/v2/pokemon?limit=25`;

async function fetchPokemons() {
  try {
    const response = await fetch(apiEndpointWithLimit);
    const data = await response.json();
    const pokemons = data.results;

    for (let pokemon of pokemons) {
      const pokeData = await fetchPokemonData(pokemon.url);
      createPokemonCard(pokeData);
    }
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
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
    pokemonName.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  
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
  

window.addEventListener("load", function () {
  fetchPokemons();
});
