/**
 * Página Home
 * Primera página que ve el usuario (ruta /)
 */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderComp from "../components/HeaderComponent";
// import GoogleLoginButton from "../components/GoogleLoginButton";
import ButtonComponent from "../components/ButtonComponent";

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
  // const [isAuthenticated, setIsAuthenticated] = useState(false);           // Autenticación
  // const [user, setUser] = useState<any>(null);                             // Usuario autenticado
  const navigate = useNavigate();                                             // Activar navigate (react router dom)

  // Función useEffect de generación de fusion aleatoria en el home
  useEffect(() => {
    const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (saved.length > 0) {
      const random = saved[Math.floor(Math.random() * saved.length)];
      setRandomFusion(random);
    }
  }, []);

  // // Funcion de autenticación, obtiene tokens y user str y los guarda
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const token = params.get('token');
  //   const userStr = params.get('user');

  //   if (token && userStr) {
  //     localStorage.setItem('authToken', token);
  //     setUser(JSON.parse(decodeURIComponent(userStr)));
  //     setIsAuthenticated(true);

  //     window.history.replaceState({}, '', '/');
  //   }
  // }, []);

  // // Recuperar sesión guardada al cargar la página (F5)
  // useEffect(() => {
  //   const savedToken = localStorage.getItem('authToken');
  //   if (savedToken) {
  //     // Aquí podrías validar el token contra el backend si lo deseas
  //     // Por ahora, simplemente restauramos la sesión

  //     // Intentar obtener usuario desde localStorage (si fue guardado)
  //     const savedUser = localStorage.getItem('authUser');
  //     if (savedUser) {
  //       try {
  //         setUser(JSON.parse(savedUser));
  //         setIsAuthenticated(true);
  //         console.log('✅ Sesión restaurada:', JSON.parse(savedUser).name);
  //       } catch (error) {
  //         console.error('Error al restaurar sesión:', error);
  //         localStorage.removeItem('authToken');
  //         localStorage.removeItem('authUser');
  //       }
  //     } else {
  //       setIsAuthenticated(true);
  //       console.log('✅ Token encontrado pero sin datos de usuario');
  //     }
  //   }
  // }, []);

  // // Manejar login exitoso con Google
  // const handleGoogleLogin = async (credentialResponse: any) => {
  //   try {
  //     // credentialResponse.credential es el JWT de Google
  //     const googleToken = credentialResponse.credential;

  //     // Enviar el token de Google al backend para validar e intercambiar por JWT nuestro
  //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ googleToken }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Error al autenticar con Google');
  //     }

  //     const data = await response.json();

  //     // Guardar el JWT en localStorage
  //     localStorage.setItem('authToken', data.token);

  //     // Guardar datos del usuario TAMBIÉN en localStorage
  //     localStorage.setItem('authUser', JSON.stringify(data.user));


  //     // Notificar a App que estamos autenticados
  //     if (setIsAuthenticated)
  //       setIsAuthenticated(true);

  //     // Guardar datos del usuario en estado
  //     setUser(data.user);

  //     alert('✅ Login exitoso', data.user.name);
  //   }
  //   catch (error) {
  //     console.error('❌ Error en login:', error)
  //     alert('Error durante la autenticación');
  //   }
  // };

  // // Manejar logout
  // const handleLogout = () => {
  //   localStorage.removeItem('authToken');
  //   localStorage.removeItem('authUser');
  //   setUser(null);
  //   setIsAuthenticated(false);
  //   console.log('✅ Sesión cerrada');
  // };

  return (
    <div
      className="min-h-screen bg-pattern p-4 flex flex-col">
      <HeaderComp
        title="Poké_Creator"
        subtitle="Crea tu propia Fusión Pokémon usando IA"
      >
        <ButtonComponent
          text="🔀 Crear Fusión"
          variant="header"
          size="small"
          onClick={() => navigate("/create")}
        />
        <ButtonComponent
          text="🖼️ Galería"
          variant="header"
          size="small"
          onClick={() => navigate("/gallery")}
        />
      </HeaderComp>
      {/* * Autenticación con Google
      {isAuthenticated ? (
        <div className="mt-8 flex flex-col items-center">
          <p className= "pokemon-font-large mb-4">
            👤 {user?.name}
          </p>
          <ButtonComponent
            text="🚪 Logout"
            variant="danger"
            size="small"
            // onClick={handleLogout}
          />
        </div>
  ) : (
    <GoogleLoginButton
      onSuccess={handleGoogleLogin}
      onError={() => console.error('Error en login con Google')}
    /> 
  )*/}
      {/* } */}

      <div className="flex-1 w-full px-4 md:px-8 flex flex-col items-center justify-center">
        {/* Fusión Aleatoria - Featured */}
        {
          randomFusion ? (
            <div className="w-full flex justify-center">
              <div className="p-6 md:p-8 rounded-lg shadow-2xl shadow-[var(--color-primary-light)] text-center w-full max-w-md border-4 border-[var(--color-primary-light)] bg-[var(--color-primary-dark)]">
                <p className="pokemon-font font-extrabold mb-4 flex justify-center">
                  ✨ Fusión Destacada ✨
                </p>

                {/* Imagen */}
                <div className="cylinder mb-6 flex items-center justify-center border-[var(--color-primary-light)] border-2 rounded-md">
                  <img
                    src={randomFusion.image}
                    alt={randomFusion.name}
                    className="max-w-full h-auto object-contain rounded"
                  />
                </div>

                {/* Nombre */}
                <h2 className="pokemon-font-small text-lg md:text-xl mb-2">
                  {randomFusion.name}
                </h2>

                {/* Info */}
                <p className="pokemon-font-clean text-xs md:text-sm font-mono mb-2">
                  {randomFusion.pokemon1.toUpperCase()} + {randomFusion.pokemon2.toUpperCase()}
                </p>

                <p className="text-gray-400 text-xs md:text-sm font-mono mb-4">
                  {new Date(randomFusion.createdAt).toLocaleDateString("es-ES")}
                </p>

                {/* Botón a Galería */}
                <ButtonComponent
                  text="Ver más en la galería"
                  size="small"
                  variant="header"
                  onClick={() => navigate("/gallery")}
                />
              </div>
            </div>
          ) : (
            // Si no hay fusiones
            <div className="w-full flex justify-center">
              <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-[var(--color-primary-light)] flex flex-col items-center justify-center gap-6">
                <p className="pokemon-font mb-5">
                  [Aún no hay fusiones... ¡Crea la primera!]
                </p>
                <ButtonComponent
                    text="🔀 Crear Fusión"
                    size="large"
                    variant="header"
                    onClick={() => navigate("/create")}>
                  </ButtonComponent>
              </div>
            </div>
          )
        }
      </div>
    </div >
  );
}

export default Home;
