/**
 * Página Home
 * Primera página que ve el usuario (ruta /)
 */

import { Link } from "react-router-dom";
import Header from "../Header";

function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url(/lab-background.png)" }}
    >
      {/* Contenedor con título e intro */}
      <div className="monitor-screen p-8 rounded-lg shadow-2xl text-center w-full">
        <Header titulo="PokéCreator" />

        {/* Texto descriptivo */}
        <p className="mt-4 text-yellow-400 font-mono text-sm">
          Crea tu propio Pokémon con IA_
        </p>

        {/* Botones con Links */}
        <div className="flex gap-4 flex-wrap justify-center text-yellow-400 pokemon-font-small mt-8">
          <Link to="/create">🔀 Crear Fusión</Link>
          <Link to="/gallery">🖼️ Galería</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

/**
 * HOME.TSX
 * ═══════════════════════════════════════════════════════════════
 *
 * QUÉ ES:
 * Home.tsx es la página principal (/). Lo primero que ve el usuario.
 *
 * ESTRUCTURA:
 * 1. IMPORTS: Header, PokemonSelector (componentes que necesitamos)
 * 2. FUNCIÓN Home(): Retorna el JSX (lo que se ve en pantalla)
 * 3. EXPORT: Exportamos Home para que App.tsx lo use
 *
 * EL JSX (lo que retorna):
 * <div className="min-h-screen...">
 *   ├─ Pantalla completa con fondo de laboratorio
 *   ├─ Header con título "PokéCreator"
 *   └─ Contenedor central con:
 *       ├─ PokemonSelector 1
 *       ├─ Botón ⚡ (fusion)
 *       └─ PokemonSelector 2
 *
 * CÓMO SE USA:
 * App.tsx importa Home y lo renderiza en <Route path="/">
 * Cuando usuario va a /, ve esta página.
 *
 * COMPONENTES ANIDADOS:
 * Home.tsx usa Header y PokemonSelector
 * ├─ Header: Muestra título (prop: titulo)
 * └─ PokemonSelector: Selector con API (prop: label)
 *
 * DATOS FLUYEN ASÍ:
 * Home (contiene)
 * ├─ Header (recibe titulo="PokéCreator")
 * └─ PokemonSelector (recibe label="POKÉMON 1 o 2")
 *    └─ Fetch de PokeAPI
 */
