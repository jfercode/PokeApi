import HeaderComp from "../components/HeaderComponent";
import { useState, useCallback, useEffect } from "react";
import PokemonSelector from "../components/PokemonSelector";
import { useNavigate } from "react-router-dom";
import FusionPanel from "../components/FusionPanel";
import ButtonComponent from "../components/ButtonComponent";

// Interface for Pokemon data from PokeAPI
interface PokemonData {
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  egg_groups?: Array<{ name: string }>;
  sprites?: {
    front_default: string;
  };
}

// Interface for fusion result data
interface FusionResult {
  id: string;
  name: string;
  pokemon1: string;
  pokemon2: string;
  image: string;
  createdAt: string;
}

// Create page component - fusion generation interface
// Allows users to select two Pokemon and generate an AI-based fusion image
function Create() {
  // Pokemon selection states
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [pokemon1Data, setPokemon1Data] = useState<PokemonData | null>(null);
  const [pokemon2Data, setPokemon2Data] = useState<PokemonData | null>(null);

  // Fusion generation states
  const [fusionName, setFusionName] = useState("");
  const [fusionResult, setFusionResult] = useState<FusionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  // Call backend API to generate fusion image
  const callGenerateFusion = async (pokemon1Data: PokemonData, pokemon2Data: PokemonData) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      // Extract minimal required data (excluding large objects like sprites)
      const pokemon1Minimal = {
        name: pokemon1Data.name,
        types: pokemon1Data.types,
        abilities: pokemon1Data.abilities,
      };

      const pokemon2Minimal = {
        name: pokemon2Data.name,
        types: pokemon2Data.types,
        abilities: pokemon2Data.abilities,
      };

      const response = await fetch(`${backendUrl}/api/generate-fusion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pokemon1Data: pokemon1Minimal,
          pokemon2Data: pokemon2Minimal
        }),
      });

      if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);

      const data = await response.json();

      console.log('Backend response: ', data);
      console.log('Image URL: ', data.imageUrl);

      return data;
    } catch (error) {
      console.error('Error calling generate fusion: ', error);
      throw error;
    }
  };

  // Handle fusion generation
  const handleFusion = async () => {
    if (!pokemon1 || !pokemon2 || !pokemon1Data || !pokemon2Data) {
      alert("Please select 2 Pokemon");
      return;
    }

    if (pokemon1 === pokemon2) {
      alert("Please select 2 different Pokemon");
      return;
    }

    setIsLoading(true);

    try {
      const result = await callGenerateFusion(pokemon1Data, pokemon2Data);

      const fusionResult: FusionResult = {
        id: Date.now().toString(),
        name: `${pokemon1} & ${pokemon2}`,
        pokemon1: pokemon1,
        pokemon2: pokemon2,
        image: result.imageUrl,
        createdAt: new Date().toISOString(),
      };

      setFusionResult(fusionResult);
    } catch (error) {
      console.error("Error generating fusion:", error);
      alert("❌ Error generating fusion");
    } finally {
      setIsLoading(false);
    }
  };

  // Save fusion to gallery (localStorage)
  const handleSaveToGallery = () => {
    if (!isAuthenticated) {
      alert("⚠️ You must login to save your fusion");
      navigate("/");
      return;
    }

    if (!fusionResult) {
      alert("No fusion to save");
      return;
    }

    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // Check if fusion already exists
    const alreadyExists = saved.some((f: FusionResult) => f.id === fusionResult.id);

    if (alreadyExists) {
      alert("⚠️ This fusion is already saved in the gallery");
      return;
    }

    const fusionToSave = {
      ...fusionResult,
      name: fusionName,
    };

    saved.push(fusionToSave);
    localStorage.setItem(storageKey, JSON.stringify(saved));

    alert(`✅ Fusion "${fusionName}" saved to gallery!`);

    // Clear form
    setFusionResult(null);
    setFusionName("");
    setPokemon1("");
    setPokemon2("");
    setPokemon1Data(null);
    setPokemon2Data(null);
  };

  // Download fusion image as PNG
  const handleDownload = () => {
    if (fusionResult) {
      const link = document.createElement("a");
      link.href = fusionResult.image;
      link.download = `${fusionName || "fusion"}.png`;
      link.click();
    }
  };

  // Share fusion image URL
  const handleShare = () => {
    if (fusionResult) {
      navigator.clipboard.writeText(fusionResult.image);
      alert("📋 Fusion copied to clipboard!");
    }
  };

  // Close fusion modal
  const handleCloseModal = () => {
    setFusionResult(null);
    setFusionName("");
  };

  // Callback for Pokemon 1 selection
  const handlePokemon1Select = useCallback(
    (name: string, img: string, data: PokemonData) => {
      setPokemon1(name);
      setPokemon1Data(data);
    },
    []
  );

  // Callback for Pokemon 2 selection
  const handlePokemon2Select = useCallback(
    (name: string, img: string, data: PokemonData) => {
      setPokemon2(name);
      setPokemon2Data(data);
    },
    []
  );

  return (
    <div className="min-h-screen bg-pattern p-4 flex flex-col">
      {/* Page header */}
      <HeaderComp
        title="Fusion Panel"
        subtitle="Select two Pokemon to fuse"
      >
        <ButtonComponent
          text="🏠 Home"
          variant="header"
          size="small"
          onClick={() => navigate("/")}
        />
        <ButtonComponent
          text="🖼️ Gallery"
          variant="header"
          size="small"
          onClick={() => navigate("/gallery")}
        />
      </HeaderComp>

      {/* Pokemon selectors and fusion button */}
      <div className="flex-1 flex flex-col items-center justify-center mt-40">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 w-full max-w-xs px-4">
          {/* Pokemon 1 selector */}
          <div className="w-full md:flex-1 shrink max-w-xs">
            <label className="block text-[var(--color-primary-light)] pokemon-font mb-2 text-center md:text-base">
              Pokemon 1
            </label>
            <PokemonSelector
              label=""
              onSelect={handlePokemon1Select}
            />
          </div>

          {/* Fusion generation button with animation */}
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
            aria-label="Generate Pokemon fusion"
          >
            {isLoading ? "⏳" : "⚡"}
          </button>

          {/* Pokemon 2 selector */}
          <div className="w-full md:flex-1 shrink max-w-xs">
            <label className="block text-[var(--color-primary-light)] pokemon-font mb-2 text-center text-base">
              Pokemon 2
            </label>
            <PokemonSelector
              label=""
              onSelect={handlePokemon2Select}
            />
          </div>
        </div>
      </div>

      {/* Fusion result modal */}
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
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

export default Create;