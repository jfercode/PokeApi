import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import FusionCard from "../components/FusionCard"

interface Fusion {
    id: string;
    name: string;
    pokemon1: string;
    pokemon2: string;
    image: string;
    createdAt: string;
}

function Gallery() {

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
            className="min-h-screen bg-cover bg-center p-4"
            style={{ backgroundImage: "url(/lab-background.png)" }}
        >
            {/* Encabezado */}
            <div className="monitor-screen p-8 rounded-lg shadow-2xl text-center w-full mb-8">
                <Header titulo="Galería de arte" />
                <p className="text-yellow-400 mb-6 text-lg font-mono pokemon-font">
                    Fusiones creadas
                </p>
                {/* Botones con Links */}
                <div className="flex gap-4 flex-wrap justify-center text-yellow-400 pokemon-font-small mt-8">
                    <Link to="/">🏠 Home</Link>
                    <Link to="/create">🔀 Crear Fusión</Link>
                </div>
            </div>
            {/** Contenido de la galería */}
            {isEmpty ? (
                // Si NO hay fusiones
                <div className="flex justify-center mt-16">
                    <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-yellow-400">
                        <p className="pokemon-font font-mono text-sm">
                            [No hay fusiones guardadas]
                        </p>
                        <p className="pokemon-font text-xs mt-4">
                            <Link to="/create" className="underline hover:text-blue-300">
                                Crea tu primera fusión →
                            </Link>
                        </p>
                    </div>
                </div>
            ) : (
                // Si hay fusiones - Mostrar grid con FusionCard
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {fusions.map((fusion) => (
                        <div key={fusion.id} className="h-full">
                            <FusionCard
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
    )
}

export default Gallery;
