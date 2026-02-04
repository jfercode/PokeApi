import ButtonComponent from "./ButtonComponent";

// Props interface for FusionCard component
interface FusionCardProps {
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
    isAuthenticated?: boolean;
}

// Card component displaying a Pokemon fusion with metadata and action buttons
// Shows fusion image, names of constituent Pokemon, creation date, and available actions
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
    isAuthenticated = false,
}: FusionCardProps) {

    return (
        <div className="w-full px-4 md:px-8 flex flex-col items-center justify-center">
            <div className="bg-[var(--color-primary-dark)] p-6 md:p-8 rounded-lg shadow-2xl text-center w-full md:w-auto md:max-w-md border-4 border-[var(--color-primary-light)]">

                {/* Fusion image display */}
                <div className="cylinder mb-6 flex items-center justify-center border-[var(--color-primary-light)] border-2 rounded-md">
                    <img
                        src={image}
                        alt={name}
                        className="max-w-full h-auto object-contain rounded"
                    />
                </div>

                {/* Fusion name */}
                <h2 className="text-[var(--color-primary-light)] pokemon-font font-bold text-lg md:text-xl mb-4">
                    {name}
                </h2>

                {/* Base Pokemon names */}
                <p className="text-[var(--color-primary)] text-xs md:text-sm font-mono mb-4">
                    {pokemon1.toUpperCase()} + {pokemon2.toUpperCase()}
                </p>

                {/* Creation timestamp */}
                <p className="text-gray-400 text-xs md:text-sm font-mono mb-6">
                    {new Date(createdAt).toLocaleString("es-ES")}
                </p>

                {/* Action buttons */}
                <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
                    {!isAuthenticated && (
                        <p className="text-[var(--color-primary-light)] text-xs md:text-sm mb-4 w-full">
                            Sign in to save, download or share your fusion
                        </p>
                    )}

                    {isAuthenticated && onSave && (
                        <ButtonComponent
                            text="💾 Save"
                            size="medium"
                            variant="header"
                            onClick={onSave}>
                        </ButtonComponent>
                    )}

                    {isAuthenticated && onDownload && (
                        <ButtonComponent
                            text="⬇️ Download"
                            size="medium"
                            variant="header"
                            onClick={onDownload}>
                        </ButtonComponent>
                    )}

                    {isAuthenticated && onShare && (
                        <ButtonComponent
                            text="📤 Share"
                            size="medium"
                            variant="header"
                            onClick={onShare}>
                        </ButtonComponent>
                    )}

                    {isAuthenticated && onDelete && (
                        <ButtonComponent
                            text="🗑️ Delete"
                            variant="header"
                            size="medium"
                            onClick={onDelete}>
                        </ButtonComponent>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FusionCard;