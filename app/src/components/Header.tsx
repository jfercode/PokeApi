// Props interface for Header component
interface HeaderProps {
  titulo: string;
}

// Simple header component displaying the application title
// Styled with Pokemon-inspired retro typography
function Header(props: HeaderProps) {
  return (
    <header className="text-4xl font-bold pokemon-title mb-4">
      {props.titulo}
    </header>
  );
}

export default Header;
