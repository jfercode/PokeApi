
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

}: FusionResultProps) {
  // Estado vacío - Mostrar mensaje de instrucciones
  if (!fusionResult) {
    return (
      <div className="flex justify-center mt-16">
        <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-yellow-400">
          <p className="pokemon-font font-mono text-sm">
            Selecciona 2 Pokémon y haz click en ⚡
          </p>
        </div>
      </div>
    );
  }


  // Resultado de la fusión - Mostrar imagen y controles
  return (
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
