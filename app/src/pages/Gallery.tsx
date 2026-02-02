import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import FusionCard from "../components/FusionCard"
import HeaderComp from "../components/HeaderComponent"
import ButtonComponent from "../components/ButtonComponent"

interface Fusion {
    id: string;
    name: string;
    pokemon1: string;
    pokemon2: string;
    image: string;
    createdAt: string;
}

function Gallery() {

    const navigate = useNavigate();                                             // Activar navigate (react router dom)
    const [fusions, setFusions] = useState<Fusion[]>([]);
    const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;

    // Obtención de fusiones guardadas en localStorage 
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); setFusions(saved);
    }, []);

    // Eliminación de fusiones (localStorage)
    const handleDelete = (id: string) => {
        const updated = fusions.filter(fusion => fusion.id !== id)
        setFusions(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        alert("❌ Fusión " + id + " eliminada");
    }

    // Descargar la fusion (.png)
    const handleDownload = (image: string, name: string) => {
        const link = document.createElement("a");
        link.href = image;
        link.download = `${name}.png`;
        link.click();
    };

    // Función para compartir ("URL")
    const handleShare = (image: string) => {
        navigator.clipboard.writeText(image);
        alert("📋 URL copiada al portapapeles!");
    };

    // Verificación previa de fusiones
    const isEmpty = fusions.length === 0;

    return (
        <div
            className="min-h-screen bg-pattern p-4 flex flex-col">
            <HeaderComp
                title="Galería de fusiones"
                subtitle="Hecha un vistazo a las fusiones creadas"
            >
                <ButtonComponent
                    text="🏠 Inicio"
                    variant="header"
                    size="small"
                    onClick={() => navigate("/")}
                />
                <ButtonComponent
                    text="🔀 Crear Fusión"
                    variant="header"
                    size="small"
                    onClick={() => navigate("/create")}
                />
            </HeaderComp>
            {/** Contenido de la galería */}

            <div className="flex items-center justify-center mt-[200px]">
                {isEmpty ? (
                    // Si NO hay fusiones
                    <div className="w-full flex justify-center">
                        <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-[var(--color-primary-light)] flex flex-col items-center justify-center gap-6">
                            <p className="pokemon-font mb-5">
                                [Aún no hay fusiones... ¡Crea la primera!]
                            </p>
                            <ButtonComponent
                                text="🔀 Crear Fusión"
                                size="large"
                                variant="header"
                                onClick={() => navigate("/create")}>
                            </ButtonComponent>
                        </div>
                    </div>

                ) : (
                    // Si hay fusiones - Mostrar grid con FusionCard
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
