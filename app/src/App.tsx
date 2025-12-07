import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Create from "./pages/Create";

// Componente raíz de la aplicación
// Sistema de navegación SPA con React Router
function App() {
  return (
   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
    </Routes>
    );
}

export default App;

/**
 * APP.tsx
 * ═══════════════════════════════════════════════════════════════
 * 
 * QUÉ ES:
 * App.tsx = El componente principal de la app.
 * Es lo primero que ve el usuario cuando abre la web.
 * 
 * IMPORTS (línea 1-4):
 * - Routes, Route: Sistema de navegación (React Router)
 * 
 * FUNCIÓN APP (línea 8-40):
 * return <Routes> 
 *   └─ <Route path="/">
 *       └─ Aquí va el JSX que se ve en pantalla
 * 
 * CÓMO FUNCIONA:
 * 1. Usuario abre la app → URL es /
 * 2. React Router busca <Route path="/">
 * 3. Encuentra y renderiza el JSX adentro
 * 4. En pantalla ve: Header + 2 Selectores + Botón ⚡
 * 
 */
