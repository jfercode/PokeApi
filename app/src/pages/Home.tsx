/**
 * Página Home
 * Primera página que ve el usuario (ruta /)
 */

import { Link } from "react-router-dom";
import Header from "../Header";
import { useEffect, useState } from "react";

interface Fusion {
  name: string;
  pokemon1: string;
  pokemon2: string;
  image: string;
  createAt: string;
}

function Home() {

  const [randomFusion, setRandomFusion] = useState<Fusion | null>(null);

  useEffect(() => {
    const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (saved.length > 0) {
      const random = saved[Math.floor(Math.random() * saved.length)];
      setRandomFusion(random);
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url(/lab-background.png)" }}
    >
      {/* Contenedor con título e intro */}
      <div className="monitor-screen p-8 rounded-lg shadow-2xl text-center w-full">
        <Header titulo="PokéCreator" />

        {/* Texto descriptivo */}
        <p className="mt-4 text-yellow-400 font-mono text-sm pokemon-font">
          Crea tu propio Pokémon con IA_
        </p>

        {/* Botones con Links */}
        <div className="flex gap-4 flex-wrap justify-center text-yellow-400 pokemon-font-small mt-8">
          <Link to="/create">🔀 Crear Fusión</Link>
          <Link to="/gallery">🖼️ Galería</Link>
        </div>
      </div>

      {/* Fusión Aleatoria - Featured */}
      {
        randomFusion ? (
          <div className="flex justify-center mt-12 mb-8">
            <div className="cloning-machine p-8 rounded-lg shadow-2xl text-center max-w-md border-4 border-yellow-400">
              <p className="text-yellow-400 pokemon-font-small text-sm mb-4">
                ✨ Fusión Destacada ✨
              </p>

              {/* Imagen */}
              <div className="cylinder mb-6 flex items-center justify-center">
                <img
                  src={randomFusion.image}
                  alt={randomFusion.name}
                  className="max-w-full h-auto object-contain rounded"
                />
              </div>

              {/* Nombre */}
              <h2 className="text-yellow-400 pokemon-font-small text-lg mb-2">
                {randomFusion.name}
              </h2>

              {/* Info */}
              <p className="text-green-400 text-xs font-mono mb-2">
                {randomFusion.pokemon1.toUpperCase()} + {randomFusion.pokemon2.toUpperCase()}
              </p>

              <p className="text-gray-400 text-xs font-mono mb-4">
                {new Date(randomFusion.createdAt).toLocaleDateString("es-ES")}
              </p>

              {/* Botón a Galería */}
              <Link
                to="/gallery"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold transition"
              >
                🖼️ Ver más en Galería
              </Link>
            </div>
          </div>
        ) : (
          // Si no hay fusiones
          <div className="flex justify-center mt-12">
            <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-yellow-400">
              <p className="text-yellow-400 font-mono text-sm">
                [Aún no hay fusiones... ¡Crea la primera!]
              </p>
            </div>
          </div>
        )
      }
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
