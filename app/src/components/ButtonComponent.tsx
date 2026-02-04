import { useState } from "react";

// Props interface for ButtonComponent configuration
interface ButtonComponentProps {
    text: string;
    onClick?: () => void;
    variant?: "header" | "primary";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
}

// Reusable button component with customizable variants and sizes
// Provides hover effects with animations and multiple style options
function ButtonComponent(props: ButtonComponentProps) {

    const [isHovered, setIsHovered] = useState(false);

    // Base styling applied to all button variants
    const baseClasses = "font-bold uppercase transition-all duration-300 rounded cursor-pointer pokemon-font-clean";

    // Color variants with hover effects
    const colorClasses = {
        header: "bg-[var(--color-primary)] transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-[0_0_15px_var(--color-primary-light)] hover:-translate-y-1",
        primary: "bg-[var(--color-primary)] transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-[0_0_15px_var(--color-primary-light)] text-white",
    };

    // Size variants
    const sizeClasses = {
        small: "px-3 py-1 text-sm",
        medium: "px-5 py-2 text-base",
        large: "px-7 py-3 text-lg"
    };

    const variant = props.variant || "header";
    const size = props.size || "medium";

    // Combine all classes
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
