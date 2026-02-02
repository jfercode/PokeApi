/**
 * Página Create - Panel de Fusión Completo
 */

import HeaderComp from "../components/HeaderComponent";
import { useState, useCallback, useEffect } from "react";
import PokemonSelector from "../components/PokemonSelector";
import { useNavigate } from "react-router-dom";
import FusionPanel from "../components/FusionPanel";
import ButtonComponent from "../components/ButtonComponent";

interface PokemonData {
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  egg_groups?: Array<{ name: string }>;
}

interface FusionResult {
  id: string;
  name: string;
  pokemon1: string;
  pokemon2: string;
  image: string;
  createdAt: string;
}

function Create() {
  // Estados de Pokémon
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [pokemon1Data, setPokemon1Data] = useState<PokemonData | null>(null);
  const [pokemon2Data, setPokemon2Data] = useState<PokemonData | null>(null);

  // Estados de la fusión
  const [fusionName, setFusionName] = useState("");
  const [fusionResult, setFusionResult] = useState<FusionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Uso de navigate de react para moverse
  const navigate = useNavigate();                                             // Activar navigate (react router dom)


  const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;

  // Obtener el usuario logueado del localStorage
  useEffect(() => {
    const googleUser = localStorage.getItem("googleUser");
    if (googleUser) {
      try {
        const user = JSON.parse(googleUser);
        // Obtener email o name del usuario
      } catch (error) {
        console.error("Error al parsear usuario:", error);
      }
    }
  }, []);

  // Generar imagen con Pollinations.ai
  const generateFusionImage = async (
    poke1Data: PokemonData,
    poke2Data: PokemonData
  ) => {
    const prompt = `
Create a high-quality single Pokemon fusion artwork combining ${poke1Data.name} and ${poke2Data.name}.

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
6. Creating a single one Pokemon

Style: Official Pokemon game art, high resolution, vibrant colors, detailed features.
    `.trim();

    const encoded = encodeURIComponent(prompt);
    const pollApi = import.meta.env.VITE_POLLINATIONS_API;
    return `${pollApi}/${encoded}`;
  };

  // Click en ⚡ - Generar fusión
  const handleFusion = async () => {
    if (!pokemon1 || !pokemon2 || !pokemon1Data || !pokemon2Data) {
      alert("Por favor selecciona 2 Pokémon");
      return;
    }

    if (pokemon1 === pokemon2) {
      alert("Por favor selecciona 2 Pokémon diferentes");
      return;
    }

    setIsLoading(true);

    try {
      const imageUrl = await generateFusionImage(pokemon1Data, pokemon2Data);

      const fusion: FusionResult = {
        id: Date.now().toString(),
        name:
          fusionName ||
          `${pokemon1.charAt(0).toUpperCase()}${pokemon2
            .charAt(0)
            .toUpperCase()}`,
        pokemon1,
        pokemon2,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      setFusionResult(fusion);
      setFusionName(fusion.name);
    } catch (error) {
      console.error("Error generando fusión:", error);
      alert("❌ Error al generar la fusión");
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar en Gallery (localStorage)
  const handleSaveToGallery = () => {
    if (!fusionResult) {
      alert("No hay fusión para guardar");
      return;
    }

    if (!fusionName.trim()) {
      alert("Por favor nombra tu fusión");
      return;
    }

    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // Verificar si ya existe una fusión con ese ID
    const alreadyExists = saved.some((f: FusionResult) => f.id === fusionResult.id);

    if (alreadyExists) {
      alert("⚠️ Esta fusión ya está guardada en la galería");
      return;
    }

    const fusionToSave = {
      ...fusionResult,
      name: fusionName,
    };

    saved.push(fusionToSave);
    localStorage.setItem(storageKey, JSON.stringify(saved));

    alert(`✅ ¡Fusión "${fusionName}" guardada en la galería!`);

    // Limpiar formulario
    setFusionResult(null);
    setFusionName("");
    setPokemon1("");
    setPokemon2("");
    setPokemon1Data(null);
    setPokemon2Data(null);
  };

  // Descargar imagen
  const handleDownload = () => {
    if (fusionResult) {
      const link = document.createElement("a");
      link.href = fusionResult.image;
      link.download = `${fusionName || "fusion"}.png`;
      link.click();
    }
  };

  // Compartir - Copia texto descriptivo
  const handleShare = () => {
    if (fusionResult) {
      navigator.clipboard.writeText(fusionResult.image);
      alert("📋 Fusión copiada al portapapeles!");
    }
  };

  // Cerrar modal de fusión
  const handleCloseModal = () => {
    setFusionResult(null);
    setFusionName("");
  };

  // Callbacks para los selectores
  const handlePokemon1Select = useCallback(
    (name: string, img: string, data: PokemonData) => {
      setPokemon1(name);
      setPokemon1Data(data);
    },
    []
  );

  const handlePokemon2Select = useCallback(
    (name: string, img: string, data: PokemonData) => {
      setPokemon2(name);
      setPokemon2Data(data);
    },
    []
  );

  return (
    <div
      className="min-h-screen bg-pattern p-4 flex flex-col"
    >
      {/* Encabezado */}
      <HeaderComp
        title="Panel de Fusión"
        subtitle="Selecciona dos Pokémon para fusionar"
      >
        <ButtonComponent
          text="🏠 Inicio"
          variant="header"
          size="small"
          onClick={() => navigate("/")}
        />
        <ButtonComponent
          text="🖼️ Galería"
          variant="header"
          size="small"
          onClick={() => navigate("/gallery")}
        />
      </HeaderComp>

      {/* Selectores y botón de fusión */}
      <div className="flex-1 flex flex-col items-center justify-center mt-40">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 w-full max-w-xs px-4">
          {/* Selector 1 - Pokémon 1 */}
          <div className="w-full md:flex-1 shrink max-w-xs">
            <label className="block text-[var(--color-primary-light)] pokemon-font mb-2 text-center md:text-base">
              Pokémon 1
            </label>
            <PokemonSelector
              label=""
              onSelect={handlePokemon1Select}
            />
          </div>

          {/* Botón de fusión con animación */}
          <button
            onClick={handleFusion}
            disabled={isLoading || !pokemon1 || !pokemon2}
            style={{
              animation: isLoading ? "spin 1s linear infinite" : "none",
            }}
            className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 sm:border-6 md:border-8 border-[var(--color-primary-light)] flex items-center justify-center text-2xl sm:text-3xl font-bold transition-colors flex-shrink-0 ${isLoading || !pokemon1 || !pokemon2
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[var(--color-primary-light)] hover:bg-[var(--color-primary)] text-black cursor-pointer"
              }`}
            aria-label="Generar fusión Pokémon"
          >
            {isLoading ? "⏳" : "⚡"}
          </button>

          {/* Selector 2 - Pokémon 2 */}
          <div className="w-full md:flex-1 shrink max-w-xs">
            <label className="block text-[var(--color-primary-light)] pokemon-font mb-2 text-center text-base">
              Pokémon 2
            </label>
            <PokemonSelector
              label=""
              onSelect={handlePokemon2Select}
            />
          </div>
        </div>
      </div>

      {/* Panel de resultado con FusionPanel - Modal */}
      <FusionPanel
        fusionResult={fusionResult}
        fusionName={fusionName}
        fusionOwner=""
        pokemon1={pokemon1}
        pokemon2={pokemon2}
        onSave={handleSaveToGallery}
        onDownload={handleDownload}
        onShare={handleShare}
        onClose={handleCloseModal}
      />
    </div >
  );
}

export default Create;

/**
 * CREATE.TSX (REFACTORIZADO)
 * ═══════════════════════════════════════════════════════════════
 *
 * QUÉ ES:
 * Create.tsx es la página de fusión de Pokémon (/create).
 * Aquí el usuario selecciona 2 Pokémon y los fusiona.
 * ESTRUCTURA:
 * 1. INTERFACES: PokemonData, FusionResult
 * 2. ESTADOS: pokemon1/2, fusionResult, etc
 * 3. EFFECTS: Obtener usuario logueado
 * 4. FUNCIONES: handleFusion, handleSave, handleDownload, handleShare
 * 5. RENDER: Selectores, botón, FusionPanel
 *
 * FLUJO:
 * 1. Usuario navega a /create
 * 2. Se obtiene el email del usuario logueado
 * 3. Ve dos selectores lado a lado
 * 4. Selecciona Pokémon 1 → Se trae su data
 * 5. Selecciona Pokémon 2 → Se trae su data
 * 6. Hace click en ⚡ → Se genera imagen con Pollinations.ai
 * 7. Aparece FusionPanel con FusionCard mostrando resultado
 * 8. Usuario nombra la fusión
 * 9. Click en 💾 Guardar → Se guarda en localStorage
 * 10. Se navega a Gallery (no automático, pero puede hacer clic en enlace)
 *
 * COMPONENTES REUTILIZADOS:
 * - Header: Muestra el título
 * - PokemonSelector: Trae lista y detalles de PokeAPI
 * - FusionPanel: Muestra el resultado (que usa FusionCard)
 */