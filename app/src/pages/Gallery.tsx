import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../Header"

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
                // Si hay fusiones - Mostrar grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {fusions.map((fusion) => (
                        <div key={fusion.id} className="fusion-card bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 shadow-2xl border-4 border-yellow-400">
                            {/* Imagen */}
                            <div className="mb-4 flex items-center justify-center bg-yellow-100 rounded-lg h-40">
                                <img
                                    src={fusion.image}
                                    alt={fusion.name}
                                    className="max-h-40 object-contain"
                                />
                            </div>

                            {/* Nombre */}
                            <h3 className="text-yellow-300 pokemon-font-small text-lg text-center mb-2">
                                {fusion.name}
                            </h3>

                            {/* Info */}
                            <p className="text-green-400 text-xs font-mono text-center mb-2">
                                {fusion.pokemon1.toUpperCase()} + {fusion.pokemon2.toUpperCase()}
                            </p>

                            {/* Fecha */}
                            <p className="text-gray-300 text-xs text-center mb-4">
                                {new Date(fusion.createdAt).toLocaleDateString("es-ES")}
                            </p>

                            {/* Botones */}
                            <div className="flex gap-2 flex-wrap justify-center">
                                <button
                                    onClick={() => handleDownload(fusion.image, fusion.name)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-bold transition text-xs"
                                >
                                    ⬇️ Descargar
                                </button>
                                <button
                                    onClick={() => handleShare(fusion.image)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded font-bold transition text-xs"
                                >
                                    📤 Compartir
                                </button>
                                <button
                                    onClick={() => handleDelete(fusion.id)}
                                    className="bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded font-bold transition text-xs"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Gallery;
