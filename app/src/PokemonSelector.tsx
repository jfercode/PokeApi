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
}

function PokemonSelector(props: PokemonSelectorProps) {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState("");
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
      fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
        .then((response) => response.json())
        .then((data: PokemonDetail) => {
          setPokemonDetail(data);
          // Pasar datos completos al parent (Create.tsx)
          if (props.onSelect && data.sprites?.front_default) {
            props.onSelect(selectedPokemon, data.sprites.front_default, data);
          }
        });
    }
  }, [selectedPokemon, props]);

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
        <div className="pokedex-card bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 shadow-2xl border-4 border-yellow-400">
          {/* Header con número */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-yellow-300 pokemon-font-small text-sm">
              {pokemonDetail.name.toUpperCase()}
            </h2>
            <span className="text-white font-bold text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              #{getPokemonNumber()}
            </span>
          </div>

          {/* Imagen en círculo */}
          <div className="cylinder mb-6 flex items-center justify-center bg-yellow-100 rounded-full w-40 h-40 mx-auto">
            <img
              src={pokemonDetail.sprites.front_default}
              alt={pokemonDetail.name}
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Tipos */}
          <div className="mb-4 text-center">
            <p className="text-white text-xs font-bold mb-2">TIPO</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {pokemonDetail.types.map((type, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-300 text-red-700 px-3 py-1 rounded-full text-xs font-bold"
                >
                  {type.type.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Stats: Altura y Peso */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
              <p className="text-yellow-300 text-xs font-bold">ALTURA</p>
              <p className="text-white font-bold">{getHeight()}</p>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
              <p className="text-yellow-300 text-xs font-bold">PESO</p>
              <p className="text-white font-bold">{getWeight()}</p>
            </div>
          </div>

          {/* Habilidades */}
          <div className="bg-black bg-opacity-30 rounded-lg p-3">
            <p className="text-yellow-300 text-xs font-bold mb-2">
              HABILIDADES
            </p>
            <div className="flex gap-2 flex-wrap">
              {getAbilities().map((ability, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-200 text-red-700 text-xs px-2 py-1 rounded font-bold"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Mientras no hay selección
        <div className="pokedex-placeholder bg-gray-700 rounded-2xl p-6 shadow-2xl border-4 border-gray-500 h-96 flex items-center justify-center">
          <p className="text-white text-center font-mono">
            Selecciona un Pokémon para ver detalles
          </p>
        </div>
      )}

      {/* Selector dropdown */}
      <div className="mt-6">
        <h3 className="text-green-400 text-xs mb-3 pokemon-font-small">
          {props.label}
        </h3>
        <select
          value={selectedPokemon}
          onChange={(e) => {
            setSelectedPokemon(e.target.value);
          }}
          className="w-full p-3 bg-black text-green-400 border-2 border-green-500 rounded pokemon-font-small text-xs hover:border-green-300 transition"
        >
          <option value="">-- SELECT POKÉMON --</option>
          {pokemons.map((pokemon: any) => (
            <option key={pokemon.name} value={pokemon.name}>
              {pokemon.name.toUpperCase()}
            </option>
          ))}
        </select>
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