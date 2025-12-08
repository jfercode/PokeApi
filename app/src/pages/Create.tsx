/**
 * Página Create - Panel de Fusión Completo
 */

import { useState } from "react";
import Header from "../Header";
import PokemonSelector from "../PokemonSelector";
import { Link } from "react-router-dom";

function Create() {
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [pokemon1Image, setPokemon1Image] = useState("");
  const [pokemon2Image, setPokemon2Image] = useState("");
  const [fusionResult, setFusionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fusionName, setFusionName] = useState("");

  // Generar imagen con Pollinations.ai
  const generateFusionImage = async (poke1, poke2, poke1Data, poke2Data) => {
    const prompt = `
Create a high-quality Pokemon fusion artwork combining ${poke1Data.name} and ${
      poke2Data.name
    }.

${poke1Data.name.toUpperCase()} (Type: ${poke1Data.types
      .map((t) => t.type.name)
      .join("/")}):
- Height: ${(poke1Data.height * 0.1).toFixed(2)}m, Weight: ${(
      poke1Data.weight * 0.1
    ).toFixed(2)}kg
- Abilities: ${poke1Data.abilities.map((a) => a.ability.name).join(", ")}
- Characteristics: ${poke1Data.types
      .map((t) => t.type.name)
      .join("/")} type pokemon

${poke2Data.name.toUpperCase()} (Type: ${poke2Data.types
      .map((t) => t.type.name)
      .join("/")}):
- Height: ${(poke2Data.height * 0.1).toFixed(2)}m, Weight: ${(
      poke2Data.weight * 0.1
    ).toFixed(2)}kg
- Abilities: ${poke2Data.abilities.map((a) => a.ability.name).join(", ")}
- Characteristics: ${poke2Data.types
      .map((t) => t.type.name)
      .join("/")} type pokemon

Blend both Pokemon seamlessly:
1. Combine their most distinctive features
2. Maintain Pokemon style and proportions
3. Use colors and patterns from both
4. Create a realistic, detailed artwork
5. Professional quality digital art

Style: Official Pokemon game art, high resolution, vibrant colors, detailed features.
  `.trim();

    const encoded = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encoded}`;
  };

  const [pokemon1Data, setPokemon1Data] = useState(null);
  const [pokemon2Data, setPokemon2Data] = useState(null);

  // Click en ⚡
  const handleFusion = async () => {
      if (!pokemon1 || !pokemon2 || !pokemon1Data || !pokemon2Data) {
    alert("Selecciona 2 Pokémon");
    return;
  }

    setIsLoading(true);
    const imageUrl = await generateFusionImage(pokemon1, pokemon2);

    const fusion = {
      id: Date.now().toString(),
      name:
        fusionName ||
        `${pokemon1.charAt(0)}${pokemon2.charAt(0)}`.toUpperCase(),
      pokemon1,
      pokemon2,
      image: imageUrl,
      createdAt: new Date().toISOString(),
    };

    setFusionResult(fusion);
    setFusionName(fusion.name);
    setIsLoading(false);
  };

  // Guardar en Gallery
  const handleSaveToGallery = () => {
    if (fusionResult) {
      const saved = JSON.parse(localStorage.getItem("pokemonFusions") || "[]");
      saved.push({ ...fusionResult, name: fusionName });
      localStorage.setItem("pokemonFusions", JSON.stringify(saved));
      alert("✅ Guardado en Gallery");
    }
  };

  // Descargar
  const handleDownload = () => {
    if (fusionResult) {
      const link = document.createElement("a");
      link.href = fusionResult.image;
      link.download = `${fusionName}.png`;
      link.click();
    }
  };

  // Compartir - Copia URL de la imagen
  const handleShare = () => {
    if (fusionResult) {
      navigator.clipboard.writeText(fusionResult.image);
      alert("📋 URL copiada al portapapeles!");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/lab-background.png)" }}
    >
      {/* Encabezado */}
      <div className="monitor-screen p-8 rounded-lg shadow-2xl text-center w-full mb-8">
        <Header titulo="Panel de Fusión" />
        <p className="text-yellow-400 mb-6 text-lg font-mono">
          &gt; Selecciona dos Pokémon para fusionar_
        </p>
        {/* Botones con Links */}
        <div className="flex gap-4 flex-wrap justify-center text-yellow-400 pokemon-font-small mt-8">
          <Link to="/">🏠 Home</Link>
          <Link to="/gallery">🖼️ Galería</Link>
        </div>
      </div>

      {/* Selectores y botón de fusión */}
      <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
        {/* Selector 1 */}
        <div>
          <PokemonSelector
            label=""
            onSelect={(name, img) => {
              setPokemon1(name);
              setPokemon1Image(img);
              setPokemon1Data(pokemon1Data)
            }}
          />
        </div>

        {/* Botón de fusión con animación de spin */}
        <button
          onClick={handleFusion}
          disabled={isLoading || !pokemon1 || !pokemon2}
          style={{
            animation: isLoading ? "spin 1s linear infinite" : "none",
          }}
          className={`w-24 h-24 rounded-full border-8 border-gray-700 flex items-center justify-center text-3xl font-bold transition-colors ${
            isLoading || !pokemon1 || !pokemon2
              ? "bg-gray-500 text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          }`}
        >
          {isLoading ? "⏳" : "⚡"}
        </button>

        {/* Selector 2 */}
        <div>
          <PokemonSelector
            label=""
            onSelect={(name, img) => {
              setPokemon2(name);
              setPokemon2Image(img);
              setPokemon2Data(pokemon2Data)
            }}
          />
        </div>
      </div>

      {/* Resultado */}
      {fusionResult && (
        <div className="flex justify-center mt-16 mb-12">
          <div className="cloning-machine p-8 rounded-lg shadow-2xl text-center max-w-md border-4 border-yellow-400">
            {/* Imagen de fusión - Sin limitaciones de tamaño */}
            <div className="cylinder mb-6 flex items-center justify-center">
              <img
                src={fusionResult.image}
                alt={fusionResult.name}
                className="max-w-full h-auto object-contain rounded"
              />
            </div>

            {/* Nombre */}
            <h2 className="text-yellow-400 pokemon-font-small text-lg mb-4">
              {fusionName}
            </h2>

            {/* Datos de fusión */}
            <p className="text-green-400 text-xs font-mono mb-4">
              {pokemon1.toUpperCase()} + {pokemon2.toUpperCase()}
            </p>
            <p className="text-gray-400 text-xs font-mono mb-6">
              {new Date(fusionResult.createdAt).toLocaleString("es-ES")}
            </p>

            {/* Botones de acción */}
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={handleSaveToGallery}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition text-sm"
              >
                💾 Guardar
              </button>
              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition text-sm"
              >
                ⬇️ Descargar
              </button>
              <button
                onClick={handleShare}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold transition text-sm"
              >
                📤 Compartir
              </button>
            </div>
          </div>
        </div>
      )}

      {!fusionResult && (
        <div className="flex justify-center mt-16">
          <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-yellow-400">
            <p className="text-yellow-400 font-mono text-sm">
              [Selecciona 2 Pokémon y haz click en ⚡]
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create;

/**
 * CREATE.TSX
 * ═══════════════════════════════════════════════════════════════
 *
 * QUÉ ES:
 * Create.tsx es la página de fusión de Pokémon (/create).
 * Aquí el usuario selecciona 2 Pokémon y los fusiona.
 *
 * ESTRUCTURA:
 * 1. IMPORTS: Header, PokemonSelector (componentes reutilizables)
 * 2. FUNCIÓN Create(): Retorna el JSX de la página
 * 3. EXPORT: Exportamos para App.tsx
 *
 * JSX (lo que se ve):
 * <div className="min-h-screen..."> → Pantalla completa
 *   ├─ <Header titulo="PokéCreator" /> → Título
 *   ├─ <PokemonSelector label="POKÉMON 1" /> → Selector izq
 *   ├─ <button>⚡</button> → Botón de fusión
 *   └─ <PokemonSelector label="POKÉMON 2" /> → Selector der
 *
 * FLUJO:
 * 1. Usuario navega a /create
 * 2. React Router renderiza <Create />
 * 3. Ve dos selectores lado a lado
 * 4. Selecciona Pokémon 1 → Se trae su imagen
 * 5. Selecciona Pokémon 2 → Se trae su imagen
 * 6. Hace click en ⚡ → (Próximo: fusionar con IA)
 *
 * TODO:
 * - Guardar en base de datos
 *
 * COMPONENTES REUTILIZADOS:
 * - Header: Muestra el título
 * - PokemonSelector: Trae lista y detalles de PokeAPI
 *
 */
