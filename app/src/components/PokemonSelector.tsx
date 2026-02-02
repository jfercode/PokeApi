/**
 * Componente PokemonSelector - Mini Pokédex
 * Muestra nombre, imagen, número y datos del Pokémon
 */

import { useState, useEffect } from "react";

interface PokemonSelectorProps {
  label: string;
  onSelect?: (name: string, image: string, pokemonData: any) => void;
}

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

function PokemonSelector(props: PokemonSelectorProps) {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null);

  // Traer lista de pokémon
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1328")
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data.results);
      });
  }, []);

  // Traer detalles del pokémon seleccionado
  useEffect(() => {
    if (selectedPokemon) {
      console.log("Detalles pokemon [", selectedPokemon, "]")

      // Fetch principal - datos del Pokémon
      const pokeApi = import.meta.env.VITE_POKEAPI_BASE;
      fetch(`${pokeApi}/pokemon/${selectedPokemon}`)
        .then((response) => response.json())
        .then((data: PokemonDetail) => {
          // Fetch secundario - datos de la especie (egg_groups)
          return fetch(`${pokeApi}/pokemon-species/${selectedPokemon}`)
            .then((response) => response.json())
            .then((speciesData) => {
              // Combinar ambos datos
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

  // Obtener tipos del Pokémon
  const getTypes = () => {
    if (!pokemonDetail?.types) return "";
    return pokemonDetail.types
      .map((t) => t.type.name.toUpperCase())
      .join(" / ");
  };

  // Convertir altura de decímetros a metros
  const getHeight = () => {
    if (!pokemonDetail?.height) return "N/A";
    return (pokemonDetail.height * 0.1).toFixed(2) + "m";
  };

  // Convertir peso de hectogramos a kg
  const getWeight = () => {
    if (!pokemonDetail?.weight) return "N/A";
    return (pokemonDetail.weight * 0.1).toFixed(2) + "kg";
  };

  // Número del Pokémon con padding
  const getPokemonNumber = () => {
    if (!pokemonDetail?.id) return "000";
    return pokemonDetail.id.toString().padStart(3, "0");
  };

  // Obtener grupos de huevo
  const getEggGroups = () => {
    if (!pokemonDetail?.egg_groups) return [];
    return pokemonDetail.egg_groups.map((eg) => eg.name.toUpperCase());
  };

  // Obtener habilidades principales (no ocultas)
  const getAbilities = () => {
    if (!pokemonDetail?.abilities) return [];
    return pokemonDetail.abilities
      .filter((a) => !a.is_hidden)
      .map((a) => a.ability.name.toUpperCase());
  };

  return (
    <div className="w-72">
      {/* MINI POKÉDEX */}
      {pokemonDetail ? (
        <div className="pokedex-card bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-6 shadow-2xl border-4 border-[var(--color-primary-light)]">
          {/* Header con número */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-white pokemon-font-clean text-sm">
              {pokemonDetail.name.toUpperCase()}
            </h2>
            <span className="text-white font-bold text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              #{getPokemonNumber()}
            </span>
          </div>

          {/* Imagen en círculo */}
          <div className="cylinder mb-6 flex items-center justify-center bg-[var(--color-primary-dark)] rounded-full w-40 h-40 mx-auto border-4 border-[var(--color-primary-light)]">
            <img
              src={pokemonDetail.sprites.front_default}
              alt={pokemonDetail.name}
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Tipos */}
          <div className="mb-4 text-center">
            <p className="text-[var(--color-primary-light)] text-xs font-bold mb-2">TIPO</p>
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

          {/* Stats: Altura y Peso */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
              <p className="text-[var(--color-primary-light)] text-xs font-bold">ALTURA</p>
              <p className="text-white font-bold">{getHeight()}</p>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
              <p className="text-[var(--color-primary-light)] text-xs font-bold">PESO</p>
              <p className="text-white font-bold">{getWeight()}</p>
            </div>
          </div>
          {/* Grupos de Huevo */}
          <div className="bg-black bg-opacity-30 rounded-lg p-3 mt-3 mb-4">
            <p className="text-[var(--color-primary-light)] text-xs font-bold mb-2">
              GRUPOS DE HUEVO
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
          {/* Habilidades */}
          <div className="bg-black bg-opacity-30 rounded-lg p-3">
            <p className="text-[var(--color-primary-light)] text-xs font-bold mb-2">
              HABILIDADES
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
        // Mientras no hay selección
        <div className="pokedex-placeholder bg-[var(--color-primary-dark)] rounded-2xl p-6 shadow-2xl border-4 border-[var(--color-primary-light)] h-96 flex items-center justify-center">
          <p className="text-[var(--color-primary-light)] text-center font-mono">
            Selecciona un Pokémon para ver detalles
          </p>
        </div>
      )}

      {/* Selector búsqueda por texto */}
      <div className="mt-6">
        <h3 className="text-[var(--color-primary-light)] text-xs mb-3 pokemon-font-small">
          {props.label}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full p-3 bg-black text-[var(--color-primary-light)] border-2 border-[var(--color-primary-light)] rounded pokemon-font-small text-xs hover:border-[var(--color-primary)] transition focus:outline-none focus:border-[var(--color-primary)]"
          />

          {/* Sugerencias - Lista filtrada */}
          {showSuggestions && searchText && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border-2 border-[var(--color-primary-light)] rounded max-h-48 overflow-y-auto z-50">
              {pokemons
                .filter((pokemon: any) =>
                  pokemon.name.toUpperCase().includes(searchText.toUpperCase())
                )
                .slice(0, 10) // Limitar a 10 resultados
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

/**
 * POKEMONSELECTOR.TSX - MINI POKÉDEX
 * ═══════════════════════════════════════════════════════════════
 *
 * QUÉ ES:
 * Mini Pokédex que muestra datos detallados de cada Pokémon:
 * - Nombre y número Pokédex
 * - Imagen del Pokémon
 * - Tipos (fuego, agua, planta, etc)
 * - Altura y peso
 * - Información de características
 *
 * INTERFAZ (PokemonDetail):
 * - id: número del Pokémon en la Pokédex
 * - name: nombre del Pokémon
 * - sprites.front_default: URL de la imagen
 * - height: altura en decímetros
 * - weight: peso en hectogramos
 * - types: array de tipos del Pokémon
 *
 * FUNCIONES AUXILIARES:
 * - getTypes(): Retorna tipos del Pokémon formateados
 * - getHeight(): Convierte decímetros a metros
 * - getWeight(): Convierte hectogramos a kg
 * - getPokemonNumber(): Formatea número con ceros (001, 025, etc)
 *
 * FLUJO:
 * 1. Usuario selecciona Pokémon en dropdown
 * 2. useEffect obtiene datos de PokeAPI
 * 3. setPokemonDetail(data) con info completa
 * 4. onSelect() envía datos completos a parent (Create.tsx)
 * 5. Renderiza mini Pokédex con todos los datos
 *
 * DATOS ENVIADOS AL PARENT:
 * La función onSelect ahora recibe:
 * - name: nombre del Pokémon
 * - image: URL de la imagen
 * - pokemonData: OBJETO COMPLETO con todos los datos
 *   └─ Esto permite que Create.tsx use mucha más info para la fusión IA
 *
 * ESTILOS:
 * - Fondo rojo degradado (como Pokédex real)
 * - Borde amarillo (#ffcc00)
 * - Imagen en círculo blanco
 * - Tipos en badges amarillos
 * - Stats en boxes oscuros
 */