/**
 * Página Home
 * Primera página que ve el usuario (ruta /)
 */
import { Link } from "react-router-dom";
import Header from "../components/Header";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useEffect, useState } from "react";

interface Fusion {
  id?: string;
  name: string;
  pokemon1: string;
  pokemon2: string;
  image: string;
  createdAt: string;
}

function Home() {

  const [randomFusion, setRandomFusion] = useState<Fusion | null>(null);      // Random image here 
  const [isAuthenticated, setIsAuthenticated] = useState(false);              // Autenticación
  const [user, setUser] = useState<any>(null);                                // Usuario autenticado

  // Función useEffect de generación de fusion aleatoria en el home
  useEffect(() => {
    const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (saved.length > 0) {
      const random = saved[Math.floor(Math.random() * saved.length)];
      setRandomFusion(random);
    }
  }, []);

  // Funcion de autenticación, obtiene tokens y user str y los guarda
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      localStorage.setItem('authToken', token);
      setUser(JSON.parse(decodeURIComponent(userStr)));
      setIsAuthenticated(true);

      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Recuperar sesión guardada al cargar la página (F5)
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      // Aquí podrías validar el token contra el backend si lo deseas
      // Por ahora, simplemente restauramos la sesión

      // Intentar obtener usuario desde localStorage (si fue guardado)
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          console.log('✅ Sesión restaurada:', JSON.parse(savedUser).name);
        } catch (error) {
          console.error('Error al restaurar sesión:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      } else {
        setIsAuthenticated(true);
        console.log('✅ Token encontrado pero sin datos de usuario');
      }
    }
  }, []);

  // Manejar login exitoso con Google
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      // credentialResponse.credential es el JWT de Google
      const googleToken = credentialResponse.credential;

      // Enviar el token de Google al backend para validar e intercambiar por JWT nuestro
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleToken }),
      });

      if (!response.ok) {
        throw new Error('Error al autenticar con Google');
      }

      const data = await response.json();

      // Guardar el JWT en localStorage
      localStorage.setItem('authToken', data.token);

      // Guardar datos del usuario TAMBIÉN en localStorage
      localStorage.setItem('authUser', JSON.stringify(data.user));

      
      // Notificar a App que estamos autenticados
      if (setIsAuthenticated)
        setIsAuthenticated(true);
      
      // Guardar datos del usuario en estado
      setUser(data.user);

      alert('✅ Login exitoso', data.user.name);
    }
    catch (error) 
    {
      console.error('❌ Error en login:', error)
      alert('Error durante la autenticación');
    }
  };

  // Manejar logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ Sesión cerrada');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url(/lab-background.png)" }}
    >
      {/* Contenedor con título e intro */}
      <div className=" monitor-screen p-8 rounded-lg shadow-2xl text-center w-full">
        <Header titulo="PokéCreator" />

        {/* Texto descriptivo */}
        <p className="mt-4 text-yellow-400 font-mono text-sm pokemon-font">
          Crea tu propio Pokémon con IA_
        </p>

        {/* Botones con Links */}
        <div className="flex gap-4 flex-wrap justify-center text-yellow-400 pokemon-font-small mt-8">
          <Link to="/create">🔀 Crear Fusión</Link>
          <Link to="/gallery">🖼️ Galería</Link>
        </div>

        {/** Autenticación con Google */}
        {isAuthenticated ? (
          <div className="mt-8">
            <p className="text-yellow-400 pokemon-font-small mb-4">
              👤 {user?.name}
            </p>
            <button
              onClick={handleLogout}
              className="text-yellow-400 px-6 py-2 rounded font-bold transition pokemon-font-small"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        ) : (
          <GoogleLoginButton
            onSuccess={handleGoogleLogin}
            onError={() => console.error('Error en login con Google')}
          />
        )}
      </div>

      {/* Fusión Aleatoria - Featured */}
      {
        randomFusion ? (
          <div className="flex justify-center mt-12 mb-8">
            <div className="cloning-machine p-8 rounded-lg shadow-2xl text-center max-w-md border-4 border-yellow-400">
              <p className="text-yellow-400 pokemon-font-small text-sm mb-4">
                ✨ Fusión Destacada ✨
              </p>

              {/* Imagen */}
              <div className="cylinder mb-6 flex items-center justify-center">
                <img
                  src={randomFusion.image}
                  alt={randomFusion.name}
                  className="max-w-full h-auto object-contain rounded"
                />
              </div>

              {/* Nombre */}
              <h2 className="text-yellow-400 pokemon-font-small text-lg mb-2">
                {randomFusion.name}
              </h2>

              {/* Info */}
              <p className="text-green-400 text-xs font-mono mb-2">
                {randomFusion.pokemon1.toUpperCase()} + {randomFusion.pokemon2.toUpperCase()}
              </p>

              <p className="text-gray-400 text-xs font-mono mb-4">
                {new Date(randomFusion.createdAt).toLocaleDateString("es-ES")}
              </p>

              {/* Botón a Galería */}
              <Link
                to="/gallery"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold transition"
              >
                🖼️ Ver más en Galería
              </Link>
            </div>
          </div>
        ) : (
          // Si no hay fusiones
          <div className="flex justify-center mt-12">
            <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-yellow-400">
              <p className="text-yellow-400 font-mono text-sm">
                [Aún no hay fusiones... ¡Crea la primera!]
              </p>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Home;

/**
 * HOME.TSX
 * ═══════════════════════════════════════════════════════════════
 *
 * QUÉ ES:
 * Home.tsx es la página principal (/). Lo primero que ve el usuario.
 *
 * ESTRUCTURA:
 * 1. IMPORTS: Header, PokemonSelector (componentes que necesitamos)
 * 2. FUNCIÓN Home(): Retorna el JSX (lo que se ve en pantalla)
 * 3. EXPORT: Exportamos Home para que App.tsx lo use
 *
 * EL JSX (lo que retorna):
 * <div className="min-h-screen...">
 *   ├─ Pantalla completa con fondo de laboratorio
 *   ├─ Header con título "PokéCreator"
 *   └─ Contenedor central con:
 *       ├─ PokemonSelector 1
 *       ├─ Botón ⚡ (fusion)
 *       └─ PokemonSelector 2
 *
 * CÓMO SE USA:
 * App.tsx importa Home y lo renderiza en <Route path="/">
 * Cuando usuario va a /, ve esta página.
 *
 * COMPONENTES ANIDADOS:
 * Home.tsx usa Header y PokemonSelector
 * ├─ Header: Muestra título (prop: titulo)
 * └─ PokemonSelector: Selector con API (prop: label)
 *
 * DATOS FLUYEN ASÍ:
 * Home (contiene)
 * ├─ Header (recibe titulo="PokéCreator")
 * └─ PokemonSelector (recibe label="POKÉMON 1 o 2")
 *    └─ Fetch de PokeAPI
 */
