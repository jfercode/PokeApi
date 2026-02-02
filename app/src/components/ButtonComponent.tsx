/**
 * Componente ButtonComponent - Intento de boton simple reutilizable para todo el proyecto
 */
import { useState } from "react";

// Interfaz que define los componentes necesarios para usar el botón
interface ButtonComponentProps {
    text: string;
    onClick?: () => void;
    variant?: "header" | "primary";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
}

// Función principal del botón (definición del componente en si)
function ButtonComponent(props: ButtonComponentProps) {

    const [isHovered, setIsHovered] = useState(false); // Control del button hover

    // Clase base para todas las variantes del boton
    const baseClasses = "font-bold uppercase transition-all duration-300 rounded cursor-pointer pokemon-font-clean";

    // Variantes de color
    const colorClasses = {
        header: "bg-[var(--color-primary)] transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-[0_0_15px_var(--color-primary-light)] hover:-translate-y-1",
        primary: "bg-[var(--color-primary)] transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-[0_0_15px_var(--color-primary-light)] text-white",
    };

    // Variantes de tamaño
    const sizeClasses = {
        small: "px-3 py-1 text-sm",
        medium: "px-5 py-2 text-base",
        large: "px-7 py-3 text-lg"
    };

    const variant = props.variant || "header";
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
