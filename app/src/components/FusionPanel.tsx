import FusionCard from "./FusionCard";

// Props interface for FusionPanel component
interface FusionResultProps {
  fusionResult: any;
  fusionName: string;
  fusionOwner: string;
  pokemon1: string;
  pokemon2: string;
  onSave: () => void;
  onDownload: () => void;
  onShare: () => void;
  onClose?: () => void;
  isAuthenticated?: boolean;
}

// Modal panel displaying fusion generation results
// Shows the generated fusion image with action buttons in an overlay
function FusionResult({
  fusionResult,
  fusionName,
  fusionOwner,
  pokemon1,
  pokemon2,
  onSave,
  onDownload,
  onShare,
  onClose,
  isAuthenticated = false,
}: FusionResultProps) {
  
  // Return nothing if no fusion result available
  if (!fusionResult) {
    return null;
  }

  // Modal overlay with fusion card
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition"
          aria-label="Close modal"
        >
          ✕
        </button>
        
        {/* Fusion card content */}
        <FusionCard
          image={fusionResult.image}
          name={fusionName}
          fusionOwner={fusionOwner}
          pokemon1={pokemon1}
          pokemon2={pokemon2}
          createdAt={fusionResult.createAt || new Date()}
          onSave={onSave}
          onDownload={onDownload}
          onShare={onShare}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}

export default FusionResult;
