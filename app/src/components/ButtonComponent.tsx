/**
 * Componente ButtonComponent - Intento de boton simple reutilizable para todo el proyecto
 */
import { useState } from "react";

// Interfaz que define los componentes necesarios para usar el botón
interface ButtonComponentProps {
    text: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
}

// Función principal del botón (definición del componente en si)
function ButtonComponent(props: ButtonComponentProps) {

    const [isHovered, setIsHovered] = useState(false); // Control del button hover

    // Clase base para todas las variantes del boton
    const baseClasses = "font-bold uppercase transition-all duration-300 rounded cursor-pointer";

    // Variantes de color
    const colorClasses = {
        primary: "bg-[var(--color-primary)] text-[var(--color-background)] border-2 border-[var(--color-secondary)] hover:bg-[var(--color-primary-dark)] hover:shadow-[0_0_15px_var(--color-primary)]",
        secondary: "bg-[var(--color-secondary)] text-[var(--color-primary)] border-2 border-[var(--color-tertiary)] hover:bg-[var(--color-secondary-light)] hover:shadow-[0_0_20px_var(--color-tertiary)]",
        danger: "bg-[var(--color-danger)] text-white border-2 border-[var(--color-danger-dark)] hover:bg-[var(--color-danger-dark)] hover:shadow-[0_0_20px_var(--color-danger)]"
    };

    // Variantes de tamaño
    const sizeClasses = {
        small: "px-3 py-1 text-sm",
        medium: "px-5 py-2 text-base",
        large: "px-7 py-3 text-lg"
    };

    const variant = props.variant || "primary";
    const size = props.size || "medium";

    // Variación final resultante de la combinación de variables 
    const finalClasses = `${baseClasses} ${colorClasses[variant]} ${sizeClasses[size]}`;

    return (
        <button
            className={finalClasses}
            onClick={props.onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={props.disabled}
        >
            {props.text}
        </button>
    )
}

export default ButtonComponent;
