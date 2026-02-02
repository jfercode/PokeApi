import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Create from "./pages/Create";
import Gallery from "./pages/Gallery";
import ProtectedRoute from "./components/ProtectedRoute";

// Componente raíz de la aplicación
// Sistema de navegación SPA con React Router
function App() {

  return (
  
    <Routes>
      {/** Ruta pública: Home */}
      <Route path="/"
        element={
          <Home />} />

      {/** Ruta pública: Create */}
      <Route path="/create"
        element={
          <Create />}
      />cd

      {/** Ruta protegida: Protected */}
      <Route path="/gallery"
        element={
          // <ProtectedRoute>
            <Gallery />} />
          {/* // </ProtectedRoute>} /> */}
    </Routes>
  );
}

export default App;
