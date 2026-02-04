import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import FusionCard from "../components/FusionCard"
import HeaderComp from "../components/HeaderComponent"
import ButtonComponent from "../components/ButtonComponent"

// Interface for saved fusion data
interface Fusion {
    id: string;
    name: string;
    pokemon1: string;
    pokemon2: string;
    image: string;
    createdAt: string;
}

// Gallery page component - displays all saved Pokemon fusions
// Allows users to view, download, share, and delete their fusions
function Gallery() {

    const navigate = useNavigate();
    const [fusions, setFusions] = useState<Fusion[]>([]);
    const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;

    // Load saved fusions from localStorage on component mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setFusions(saved);
    }, []);

    // Delete a fusion from gallery
    const handleDelete = (id: string) => {
        const updated = fusions.filter(fusion => fusion.id !== id)
        setFusions(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        alert("❌ Fusion deleted");
    }

    // Download fusion image as PNG
    const handleDownload = (image: string, name: string) => {
        const link = document.createElement("a");
        link.href = image;
        link.download = `${name}.png`;
        link.click();
    };

    // Copy fusion image URL to clipboard
    const handleShare = (image: string) => {
        navigator.clipboard.writeText(image);
        alert("📋 URL copied to clipboard!");
    };

    // Check if gallery is empty
    const isEmpty = fusions.length === 0;

    return (
        <div
            className="min-h-screen bg-pattern p-4 flex flex-col">
            <HeaderComp
                title="Fusion Gallery"
                subtitle="Take a look at your created fusions"
            >
                <ButtonComponent
                    text="🏠 Home"
                    variant="header"
                    size="small"
                    onClick={() => navigate("/")}
                />
                <ButtonComponent
                    text="🔀 Create Fusion"
                    variant="header"
                    size="small"
                    onClick={() => navigate("/create")}
                />
            </HeaderComp>

            {/* Gallery content */}
            <div className="flex items-center justify-center mt-[200px]">
                {isEmpty ? (
                    // Empty gallery message
                    <div className="w-full flex justify-center">
                        <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-[var(--color-primary-light)] flex flex-col items-center justify-center gap-6">
                            <p className="pokemon-font mb-5">
                                [No fusions yet... Create the first one!]
                            </p>
                            <ButtonComponent
                                text="🔀 Create Fusion"
                                size="large"
                                variant="header"
                                onClick={() => navigate("/create")}>
                            </ButtonComponent>
                        </div>
                    </div>

                ) : (
                    // Fusions grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
                        {fusions.map((fusion) => (
                            <div key={fusion.id} className="h-full">
                                <FusionCard
                                    fusionOwner=""
                                    image={fusion.image}
                                    name={fusion.name}
                                    pokemon1={fusion.pokemon1}
                                    pokemon2={fusion.pokemon2}
                                    createdAt={fusion.createdAt}
                                    onDownload={() => handleDownload(fusion.image, fusion.name)}
                                    onShare={() => handleShare(fusion.image)}
                                    onDelete={() => handleDelete(fusion.id)}
                                    isAuthenticated={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Gallery;
