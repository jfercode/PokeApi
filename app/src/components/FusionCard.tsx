
interface FusionCardProps
{
    image: string;
    name: string;
    fusionOwner: string;
    pokemon1: string;
    pokemon2: string;
    createdAt: Date | string;
    onDownload?: () => void;
    onShare?: () => void;
    onDelete?: () => void;
    onSave?: () => void;

}

function FusionCard({
    image,
    name,
    pokemon1,
    pokemon2,
    createdAt,
    onDownload,
    onShare,
    onDelete,
    onSave,
}: FusionCardProps) {

    return (
        <div className="flex justify-center mt-16 mb-12">
            <div className="cloning-machine p-8 rounded-lg shadow-2xl text-center max-w-md border-4 border-yellow-400">

                {/* Imagen */}
                <div className="cylinder mb-6 flex items-center justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="max-w-full h-auto object-contain rounded"
                    />
                </div>

                {/* Nombre */}
                <h2 className="text-yellow-400 pokemon-font-small text-lg mb-4">
                    {name}
                </h2>

                {/* Pokémon combinados */}
                <p className="text-green-400 text-xs font-mono mb-4">
                    {pokemon1.toUpperCase()} + {pokemon2.toUpperCase()}
                </p>

                {/* Fecha */}
                <p className="text-gray-400 text-xs font-mono mb-6">
                    {new Date(createdAt).toLocaleString("es-ES")}
                </p>

                {/* Botones */}
                <div className="flex gap-3 flex-wrap justify-center">
                    {onSave && (
                        <button
                            onClick={onSave}
                            aria-label="Guardar esta fusión en mi galería"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition text-sm"
                        >
                            💾 Guardar
                        </button>
                    )}

                    {onDownload && (
                        <button
                            onClick={onDownload}
                            aria-label="Descargar imagen de la fusión en PNG"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition text-sm"
                        >
                            ⬇️ Descargar
                        </button>
                    )}

                    {onShare && (
                        <button
                            onClick={onShare}
                            aria-label="Compartir esta fusión con tus amigos"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold transition text-sm"
                        >
                            📤 Compartir
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={onDelete}
                            aria-label="Eliminar esta fusión de la galería"
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition text-sm"
                        >
                            🗑️ Eliminar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FusionCard;