import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Create from "./pages/Create";
import Gallery from "./pages/Gallery";
import ProtectedRoute from "./components/ProtectedRoute";

// Main application component with routing setup
// Defines all routes: public (Home, Create) and protected (Gallery)
// Gallery route requires authentication via ProtectedRoute wrapper
function App() {

  return (

    <Routes>
      {/* Public route: Home page - displays featured fusion and login options */}
      <Route path="/"
        element={
          <Home />} />

      {/* Public route: Create page - allows fusion generation for all users */}
      <Route path="/create"
        element={
          <Create />}
      />

      {/* Protected route: Gallery page - requires authentication to access */}
      <Route path="/gallery"
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
