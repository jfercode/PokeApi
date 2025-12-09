
/**
 * Componente FusionPanel - Panel de Resultado de Fusión
 */

interface FusionResultProps {
  fusionResult: any;
  fusionName: string;
  pokemon1: string;
  pokemon2: string;
  onSave: () => void;
  onDownload: () => void;
  onShare: () => void;
}

function FusionResult({

  fusionResult,
  fusionName,
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
    <div className="flex justify-center mt-16 mb-12">
      <div className="cloning-machine p-8 rounded-lg shadow-2xl text-center max-w-md border-4 border-yellow-400">
        {/* Imagen de fusión */}
        <div className="cylinder mb-6 flex items-center justify-center">
          <img
            src={fusionResult.image}
            alt={fusionResult.name}
            className="max-w-full h-auto object-contain rounded"
          />
        </div>

        {/* Nombre de la fusión */}
        <h2 className="text-yellow-400 pokemon-font-small text-lg mb-4">
          {fusionName}
        </h2>

        {/* Info de Pokémon combinados */}
        <p className="text-green-400 text-xs font-mono mb-4">
          {pokemon1.toUpperCase()} + {pokemon2.toUpperCase()}
        </p>
        {/* Fecha de creación */}
        <p className="text-gray-400 text-xs font-mono mb-6">
          {new Date(fusionResult.createdAt).toLocaleString("es-ES")}
        </p>

        {/* Botones de acciones */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition text-sm"
          >
            💾 Guardar
          </button>
          <button
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition text-sm"
          >
            ⬇️ Descargar
          </button>
          <button
            onClick={onShare}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold transition text-sm"
          >
            📤 Compartir
          </button>
        </div>
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
