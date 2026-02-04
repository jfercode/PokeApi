import { useState, useEffect } from "react";

// Props interface for PokemonSelector component
interface PokemonSelectorProps {
  label: string;
  onSelect?: (name: string, image: string, pokemonData: any) => void;
}

// Interface for detailed Pokemon data from PokeAPI
interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  height: number;
  weight: number;
  types: Array<{
    type: { name: string };
  }>;
  abilities: Array<{
    ability: { name: string };
    is_hidden: boolean;
  }>;
  egg_groups?: Array<{
    name: string;
    url: string;
  }>;
}

// Mini Pokedex component for selecting and displaying Pokemon details
// Fetches Pokemon data from PokeAPI and displays comprehensive information
function PokemonSelector(props: PokemonSelectorProps) {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null);

  // Fetch list of all Pokemon from PokeAPI
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1328")
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data.results);
      });
  }, []);

  // Fetch detailed information for selected Pokemon
  useEffect(() => {
    if (selectedPokemon) {
      const pokeApi = import.meta.env.VITE_POKEAPI_BASE;
      
      // Main API call for Pokemon data
      fetch(`${pokeApi}/pokemon/${selectedPokemon}`)
        .then((response) => response.json())
        .then((data: PokemonDetail) => {
          // Secondary API call for species data (egg groups)
          return fetch(`${pokeApi}/pokemon-species/${selectedPokemon}`)
            .then((response) => response.json())
            .then((speciesData) => {
              // Combine both data sources
              const completeData = {
                ...data,
                egg_groups: speciesData.egg_groups
              };
              setPokemonDetail(completeData);
              if (props.onSelect && data.sprites?.front_default) {
                props.onSelect(selectedPokemon, data.sprites.front_default, completeData);
              }
            });
        });
    }
  }, [selectedPokemon, props.onSelect]);

  // Extract and format Pokemon types
  const getTypes = () => {
    if (!pokemonDetail?.types) return "";
    return pokemonDetail.types
      .map((t) => t.type.name.toUpperCase())
      .join(" / ");
  };

  // Convert height from decimeters to meters
  const getHeight = () => {
    if (!pokemonDetail?.height) return "N/A";
    return (pokemonDetail.height * 0.1).toFixed(2) + "m";
  };

  // Convert weight from hectograms to kilograms
  const getWeight = () => {
    if (!pokemonDetail?.weight) return "N/A";
    return (pokemonDetail.weight * 0.1).toFixed(2) + "kg";
  };

  // Format Pokemon number with leading zeros
  const getPokemonNumber = () => {
    if (!pokemonDetail?.id) return "000";
    return pokemonDetail.id.toString().padStart(3, "0");
  };

  // Extract egg group names
  const getEggGroups = () => {
    if (!pokemonDetail?.egg_groups) return [];
    return pokemonDetail.egg_groups.map((eg) => eg.name.toUpperCase());
  };

  // Get non-hidden abilities
  const getAbilities = () => {
    if (!pokemonDetail?.abilities) return [];
    return pokemonDetail.abilities
      .filter((a) => !a.is_hidden)
      .map((a) => a.ability.name.toUpperCase());
  };

  return (
    <div className="w-72">
      {/* Pokemon details card */}
      {pokemonDetail ? (
        <div className="pokedex-card bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-6 shadow-2xl border-4 border-[var(--color-primary-light)]">
          {/* Header with Pokemon number */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-white pokemon-font-clean text-sm">
              {pokemonDetail.name.toUpperCase()}
            </h2>
            <span className="text-white font-bold text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              #{getPokemonNumber()}
            </span>
          </div>

          {/* Pokemon sprite in circle */}
          <div className="cylinder mb-6 flex items-center justify-center bg-[var(--color-primary-dark)] rounded-full w-40 h-40 mx-auto border-4 border-[var(--color-primary-light)]">
            <img
              src={pokemonDetail.sprites.front_default}
              alt={pokemonDetail.name}
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Pokemon types */}
          <div className="mb-4 text-center">
            <p className="text-[var(--color-primary-light)] text-xs font-bold mb-2">TYPE</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {pokemonDetail.types.map((type, idx) => (
                <span
                  key={idx}
                  className="bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] px-3 py-1 rounded-full text-xs font-bold"
                >
                  {type.type.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Height and weight stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
              <p className="text-[var(--color-primary-light)] text-xs font-bold">HEIGHT</p>
              <p className="text-white font-bold">{getHeight()}</p>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
              <p className="text-[var(--color-primary-light)] text-xs font-bold">WEIGHT</p>
              <p className="text-white font-bold">{getWeight()}</p>
            </div>
          </div>
          
          {/* Egg groups */}
          <div className="bg-black bg-opacity-30 rounded-lg p-3 mt-3 mb-4">
            <p className="text-[var(--color-primary-light)] text-xs font-bold mb-2">
              EGG GROUPS
            </p>
            <div className="flex gap-2 flex-wrap">
              {getEggGroups().map((eggGroup, idx) => (
                <span
                  key={idx}
                  className="bg-[var(--color-primary-light)] text-white text-xs px-2 py-1 rounded font-bold"
                >
                  🥚 {eggGroup}
                </span>
              ))}
            </div>
          </div>
          
          {/* Abilities */}
          <div className="bg-black bg-opacity-30 rounded-lg p-3">
            <p className="text-[var(--color-primary-light)] text-xs font-bold mb-2">
              ABILITIES
            </p>
            <div className="flex gap-2 flex-wrap">
              {getAbilities().map((ability, idx) => (
                <span
                  key={idx}
                  className="bg-[var(--color-primary-light)] text-white text-xs px-2 py-1 rounded font-bold"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Placeholder while no Pokemon is selected
        <div className="pokedex-placeholder bg-[var(--color-primary-dark)] rounded-2xl p-6 shadow-2xl border-4 border-[var(--color-primary-light)] h-96 flex items-center justify-center">
          <p className="text-[var(--color-primary-light)] text-center font-mono">
            Select a Pokemon to see details
          </p>
        </div>
      )}

      {/* Pokemon search input */}
      <div className="mt-6">
        <h3 className="text-[var(--color-primary-light)] text-xs mb-3 pokemon-font-small">
          {props.label}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full p-3 bg-black text-[var(--color-primary-light)] border-2 border-[var(--color-primary-light)] rounded pokemon-font-small text-xs hover:border-[var(--color-primary)] transition focus:outline-none focus:border-[var(--color-primary)]"
          />

          {/* Search suggestions dropdown */}
          {showSuggestions && searchText && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border-2 border-[var(--color-primary-light)] rounded max-h-48 overflow-y-auto z-50">
              {pokemons
                .filter((pokemon: any) =>
                  pokemon.name.toUpperCase().includes(searchText.toUpperCase())
                )
                .slice(0, 10)
                .map((pokemon: any) => (
                  <div
                    key={pokemon.name}
                    onClick={() => {
                      setSelectedPokemon(pokemon.name);
                      setSearchText(pokemon.name.toUpperCase());
                      setShowSuggestions(false);
                    }}
                    className="p-2 text-[var(--color-primary-light)] cursor-pointer hover:bg-[var(--color-primary-light)] hover:text-black transition pokemon-font-small text-xs"
                  >
                    {pokemon.name.toUpperCase()}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PokemonSelector;