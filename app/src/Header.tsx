/**
 * Definición del componente Header
 * Muestra el título principal de la aplicación
 */

// Interfaz que define las props que recibe el componente Header
// titulo: El texto que se mostrará en el header
interface HeaderProps {
  titulo: string;
}

// Función principal del componente Header en React
function Header(props: HeaderProps) {
  return (
    <header className="text-4xl font-bold pokemon-title mb-4">
      {props.titulo}
    </header>
  );
}

export default Header;

/**
 * HEADER.TSX
 * ═══════════════════════════════════════════════════════════════
 * 
 * QUÉ ES:
 * Header es un componente que muestra el título principal.
 * Es pequeño y reutilizable (usado en Home, Create, etc)
 * 
 * ESTRUCTURA:
 * 1. Interface HeaderProps: Define qué PROPS recibe
 *    - titulo: string (el texto del título)
 * 
 * 2. Función Header(props): 
 *    - Recibe props
 *    - Retorna un <header> con el titulo adentro
 * 
 * CÓMO FUNCIONA:
 * <Header titulo="PokéCreator" />
 *   ↓ Recibe la prop "titulo"
 *   ↓ La renderiza: <header>PokéCreator</header>
 *   ↓ Con estilos CSS: pokemon-title (color amarillo, efecto 3D)
 * 
 * PROPS:
 * titulo (string): El texto a mostrar en el header
 * 
 * ESTILOS:
 * - pokemon-title: Clase CSS personalizada (index.css)
 *   └─ Color amarillo Pokémon (#ffcb05)
 *   └─ Borde azul (#3466af)
 *   └─ Efecto 3D con sombra
 * - text-4xl: Tamaño grande
 * - font-bold: Texto en negrita
 * - mb-4: Margen inferior (Tailwind)
 */
