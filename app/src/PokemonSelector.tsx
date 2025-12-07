/**
 * Componente selector de Pokémon
 * Permite eligir un Pokémon de la lista
 */

import { useState, useEffect } from "react";

interface PokemonSelectorProps {
  label: string; // "Pokémon 1" o "Pokémon 2"
}

// Interfaz con nombre y sprite del Pokemon
interface PokemonDetail {
  name: string;
  sprites: {
    front_default: string;
  };
}

function PokemonSelector(props: PokemonSelectorProps) {
  // Estado para guardar la lista de pokémon
  const [pokemons, setPokemons] = useState([]);

  // Estado para guardar el pokémon seleccionado
  const [selectedPokemon, setSelectedPokemon] = useState("");

  // Estado para guardar los detalles del pokémon seleccionado
  const [pokemonDetail, setPokemonDetail] = useState(null);

  // Traer pokémon cuando el componente carga
  useEffect(() => {
    console.log("Obteniendo pokémons desde PokeApi...");

    // Petición a la API
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1328")
      .then((response) => response.json()) // Convierte respuesta a JSON
      .then((data) => {
        console.log("Pokémon recibidos:", data.results);
        setPokemons(data.results); // Guarda en el estado
      });
  }, []);

  useEffect(() => {
    console.log("Obteniendo nombre y sprite de [", selectedPokemon, "]");

    if (selectedPokemon) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Datos recibidos de [", selectedPokemon, "]: ", data);
          setPokemonDetail(data);
        });
    }
  }, [selectedPokemon]);

  return (
    <div className="cloning-machine w-64">
      {/* Cylinder with Pokemon image */}
      <div className="cylinder">
        {pokemonDetail && pokemonDetail.sprites.front_default ? (
          <img
            src={pokemonDetail.sprites.front_default}
            alt={selectedPokemon}
            className="pokemon-image"
          />
        ) : ( null
        )}
      </div>

      {/* Selector label */}
      <h3 className="text-green-400 text-xs mb-3 pokemon-font-small mt-2">
        {props.label}
      </h3>

      {/* Pokemon dropdown */}
      <select
        value={selectedPokemon}
        onChange={(e) => setSelectedPokemon(e.target.value)}
        className="w-full p-2 bg-black text-green-400 border-2 border-green-500 rounded pokemon-font-small text-xs"
      >
        <option value="">-- Select Pokemon --</option>

        {/* Map creates one option for each Pokemon */}
        {pokemons.map((pokemon) => (
          <option key={pokemon.name} value={pokemon.name}>
            {pokemon.name.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PokemonSelector;

/**
 * POKEMONSELECTOR.TSX
 * ═══════════════════════════════════════════════════════════════
 * 
 * QUÉ ES:
 * PokemonSelector es un componente que:
 * 1. Trae lista de Pokémon de PokeAPI (1328 Pokémon)
 * 2. Muestra un dropdown para seleccionar
 * 3. Cuando selecciona uno, obtiene su imagen (sprite)
 * 4. Muestra la imagen en un "cilindro" (círculo con efecto 3D)
 * 
 * ESTRUCTURA:
 * 1. INTERFACES (tipos de datos):
 *    - PokemonSelectorProps: Las props que recibe (label)
 *    - PokemonDetail: Estructura de datos del Pokémon (name, sprites)
 * 
 * 2. ESTADOS (useState):
 *    - pokemons: Array con lista de todos los Pokémon
 *    - selectedPokemon: String con el nombre del seleccionado
 *    - pokemonDetail: Objeto con datos completos del Pokémon
 * 
 * 3. EFECTOS (useEffect):
 *    - Efecto 1: Se ejecuta al cargar → Trae lista de PokeAPI
 *    - Efecto 2: Se ejecuta al cambiar selectedPokemon → Trae detalles
 * 
 * FLUJO DE DATOS:
 * 1. Componente carga → useEffect 1 se ejecuta
 * 2. Fetch a PokeAPI: https://pokeapi.co/api/v2/pokemon?limit=1328
 * 3. Recibe 1328 Pokémon → setPokemons(data)
 * 4. Dropdown muestra todos los nombres
 * 5. Usuario selecciona uno → onChange → setSelectedPokemon
 * 6. useEffect 2 se ejecuta
 * 7. Fetch a https://pokeapi.co/api/v2/pokemon/{nombre}
 * 8. Recibe datos: name, image URL, stats, tipos, etc
 * 9. setPokemonDetail(data)
 * 10. Renderiza la imagen en el <img>
 * 
 * JSX (lo que renderiza):
 * <div className="cloning-machine"> → Contenedor principal
 *   ├─ <div className="cylinder"> → Círculo para la imagen
 *   │  └─ <img src={imagen}> → Imagen del Pokémon
 *   ├─ <h3>{props.label}</h3> → Etiqueta ("Pokémon 1")
 *   └─ <select> → Dropdown con lista
 * 
 * PROPS:
 * - label (string): "POKÉMON 1" o "POKÉMON 2"
 * 
 * CONCEPTOS CLAVE:
 * - fetch(): Traer datos de internet (API)
 * - .then(): Esperar a que termine y procesar
 * - .json(): Convertir respuesta a objeto JavaScript
 * - useState: Guardar datos en el estado
 * - useEffect: Ejecutar código en momentos específicos
 * - [selectedPokemon]: Dependencia → Ejecuta si cambia
 */
