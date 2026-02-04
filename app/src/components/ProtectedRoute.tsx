import type React from "react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

// Props interface for ProtectedRoute component
interface ProtectedRouteProps {
    children: React.ReactNode;
}

// Protected route component that enforces authentication
// Redirects unauthenticated users to home page and shows alert
function ProtectedRoute({ children } : ProtectedRouteProps) {
    
    // Check for authentication token in localStorage
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!token) {
            alert("🔐 Sign in with Google to access all content");
        }
    }, [token]);

    // Redirect to home if not authenticated
    if (!token)
        return <Navigate to="/" replace />;
    else
        return <>{children}</>
}

export default ProtectedRoute;
