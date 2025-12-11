/**
 * Protected Route
 * Protector de rutas sensibles requiriendo autorización
 */

import type React from "react";
import { Navigate } from "react-router-dom";

// Interfaz con el contenido a mostrar si está autenticado el usuario
// y booleano de control del estado de autenticación
interface ProtectedRouteProps {
    
    children: React.ReactNode;
}

// Función Protectora de rutas sin autenticación
function ProtectedRoute({ children} : ProtectedRouteProps) {
    
     // Comprobación de si el usuario está autenticado o no
    const token = localStorage.getItem('authToken');

    if (!token)
        return <Navigate to="/" replace />;
    else
        return <>{children}</>
}

export default ProtectedRoute;

/**
 * PROTECTEDROUTE.TSX
 * ═══════════════════════════════════════════════════════════════
 * 
 * QUÉ ES:
 * Componente protector que valida autenticación antes de mostrar
 * rutas sensibles (/create, /gallery)
 * 
 * ESTRUCTURA:
 * 1. Interface ProtectedRouteProps: Define qué PROPS recibe
 *    - children: React.ReactNode (componente a renderizar si auth=true)
 *    - isAuthenticated: boolean (estado de autenticación del usuario)
 * 
 * 2. Función ProtectedRoute({ children, isAuthenticated }):
 *    - Valida si usuario está autenticado
 *    - Si NO → Redirige a home (/)
 *    - Si SÍ → Renderiza el componente protegido
 * 
 * CÓMO FUNCIONA:
 * <ProtectedRoute isAuthenticated={isAuth}>
 *   <Create />
 * </ProtectedRoute>
 *   ↓ Si isAuthenticated = false
 *   ↓ Redirige a "/" (home)
 *   ↓ Si isAuthenticated = true
 *   ↓ Renderiza <Create />
 * 
 * PROPS:
 * - children: Componente a proteger (ReactNode)
 * - isAuthenticated: boolean que indica si user tiene sesión activa
 * 
 * FLUJO DE AUTENTICACIÓN:
 * 1. Usuario intenta acceder a /create sin estar logueado
 * 2. ProtectedRoute ve isAuthenticated = false
 * 3. Ejecuta: <Navigate to="/" replace />
 * 4. Redirige a home sin dejar historial
 * 5. Si después se loquea, vuelve a /create y entra
 */
