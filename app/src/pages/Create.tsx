/**
 * Página Create
 * Panel de fusión de Pokémon (ruta /create)
 * Muestra: 2 Selectores + Botón de fusión + Resultado
 */

import Header from "../Header";
import PokemonSelector from "../PokemonSelector";

function Create() {
  return (
    /* Contenedor principal - ocupa toda la pantalla con fondo degradado */
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url(/lab-background.png)" }}
    >
      <div className="monitor-screen p-8 rounded-lg shadow-2xl text-center max-w-md absolute left-1/2 transform -translate-x-1/2">
        <Header titulo="PokéCreator" />
        <p className="text-yellow-400 mb-6 text-lg font-mono">
          &gt; Crea tu propio Pokémon con IA_
        </p>
      </div>
      {/* Contenedor central para selectores y botón de fusión */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
        {/* Selector 1 */}
        <PokemonSelector label="POKÉMON 1" />
        {/* Botón de fusión (círculo rojo)  TODO: REVIEW */}
        <button className="w-24 h-24 bg-red-600 rounded-full border-8 border-gray-700 hover:bg-red-700 transition-colors shadow-2xl">
          <span className="text-white text-2xl">⚡</span>
        </button>
        {/* Selector 2 */}
        <PokemonSelector label="POKÉMON 2" />
      </div>
    </div>
  );
}

export default Create;

/**
 * CREATE.TSX
 * ═══════════════════════════════════════════════════════════════
 * 
 * QUÉ ES:
 * Create.tsx es la página de fusión de Pokémon (/create).
 * Aquí el usuario selecciona 2 Pokémon y los fusiona.
 * 
 * ESTRUCTURA:
 * 1. IMPORTS: Header, PokemonSelector (componentes reutilizables)
 * 2. FUNCIÓN Create(): Retorna el JSX de la página
 * 3. EXPORT: Exportamos para App.tsx
 * 
 * JSX (lo que se ve):
 * <div className="min-h-screen..."> → Pantalla completa
 *   ├─ <Header titulo="PokéCreator" /> → Título
 *   ├─ <PokemonSelector label="POKÉMON 1" /> → Selector izq
 *   ├─ <button>⚡</button> → Botón de fusión
 *   └─ <PokemonSelector label="POKÉMON 2" /> → Selector der
 * 
 * FLUJO:
 * 1. Usuario navega a /create
 * 2. React Router renderiza <Create />
 * 3. Ve dos selectores lado a lado
 * 4. Selecciona Pokémon 1 → Se trae su imagen
 * 5. Selecciona Pokémon 2 → Se trae su imagen
 * 6. Hace click en ⚡ → (Próximo: fusionar con IA)
 * 
 * TODO:
 * - Conectar botón ⚡ con lógica de fusión
 * - Integrar Pollinations.ai para generar imagen
 * - Mostrar resultado de la fusión
 * - Guardar en base de datos
 * 
 * COMPONENTES REUTILIZADOS:
 * - Header: Muestra el título
 * - PokemonSelector: Trae lista y detalles de PokeAPI
 * 
 */