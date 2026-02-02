
/**
 * Componente FusionPanel - Panel de Resultado de Fusión
 */

import FusionCard from "./FusionCard";
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
}

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

}: FusionResultProps) {
  // Estado vacío - No mostrar nada
  if (!fusionResult) {
    return null;
  }


  // Modal overlay
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-md w-full">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition"
          aria-label="Cerrar"
        >
          ✕
        </button>
        
        {/* Card content */}
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
        />
      </div>
    </div>
  );
}

export default FusionResult;

/**
 * FUSIONPANEL.TSX
 * ═══════════════════════════════════════════════════════════════
 *
 * QUÉ ES:
 * FusionPanel.tsx es un componente reutilizable que muestra el resultado
 * de la fusión de dos Pokémon. Forma parte de la página Create.
 *
 * ESTRUCTURA:
 * 1. INTERFACE: Define las props del componente (FusionResultProps)
 * 2. FUNCIÓN FusionResult(): Retorna el JSX con el resultado
 * 3. EXPORT: Exportamos para que lo use Create.tsx
 *
 * PROPS:
 * - fusionResult: Objeto con los datos de la fusión (imagen, nombre, etc)
 * - fusionName: Nombre dado a la fusión por el usuario
 * - pokemon1: Nombre del primer Pokémon
 * - pokemon2: Nombre del segundo Pokémon
 * - onSave: Función callback para guardar en Gallery
 * - onDownload: Función callback para descargar la imagen
 * - onShare: Función callback para compartir
 *
 * FLUJO:
 * 1. Create.tsx genera la fusión (imagen + datos)
 * 2. Pasa los datos a FusionPanel como props
 * 3. FusionPanel renderiza la imagen y botones
 * 4. Usuario hace click en botones → Se ejecutan callbacks
 * 5. Create.tsx maneja las acciones (guardar, descargar, compartir)
 *
 * COMPONENTE REUTILIZABLE:
 * Sí, puede usarse en otras páginas si necesitan mostrar una fusión
 *
 */
