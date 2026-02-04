import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderComp from "../components/HeaderComponent";
import GoogleLoginButton from "../components/GoogleLoginButton";
import ButtonComponent from "../components/ButtonComponent";

// Interface for Fusion data structure
interface Fusion {
  id?: string;
  name: string;
  pokemon1: string;
  pokemon2: string;
  image: string;
  createdAt: string;
}

// Home page component - landing page with authentication and featured fusion
// Displays login button, user info, and showcases a random fusion from gallery
function Home() {

  const [randomFusion, setRandomFusion] = useState<Fusion | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Load random fusion from saved gallery
  useEffect(() => {
    const storageKey = import.meta.env.VITE_STORAGE_KEY_FUSIONS;
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (saved.length > 0) {
      const random = saved[Math.floor(Math.random() * saved.length)];
      setRandomFusion(random);
    }
  }, []);

  // Handle OAuth redirect parameters from backend
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

  // Restore authentication session on page load
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          console.log('✅ Session restored:', JSON.parse(savedUser).name);
        } catch (error) {
          console.error('Error restoring session:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      } else {
        setIsAuthenticated(true);
        console.log('✅ Token found without user data');
      }
    }
  }, []);

  // Handle successful Google login
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const googleToken = credentialResponse.credential;

      // Send Google token to backend for validation and JWT exchange
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleToken }),
      });

      if (!response.ok) {
        throw new Error('Error authenticating with Google');
      }

      const data = await response.json();

      // Save JWT and user data to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));

      // Update authentication state
      setIsAuthenticated(true);
      setUser(data.user);

      alert('✅ Login successful for ' + data.user.name);
    }
    catch (error) {
      console.error('❌ Login error:', error)
      alert('Error during authentication');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ Session closed');
  };

  return (
    <div
      className="min-h-screen bg-pattern p-4 flex flex-col">
      <HeaderComp
        title="PokeApi"
        subtitle="Create your own Pokemon Fusion using AI"
      >
        <ButtonComponent
          text="🔀 Create Fusion"
          variant="header"
          size="small"
          onClick={() => navigate("/create")}
        />
        <ButtonComponent
          text="🖼️ Gallery"
          variant="header"
          size="small"
          onClick={() => navigate("/gallery")}
        />
      </HeaderComp>

      <div className="flex-1 w-full px-4 md:px-8 flex flex-col items-center justify-center">
        {/* Authentication section */}
        {!isAuthenticated && (
          <div className="mt-8 mb-8 flex flex-col items-center gap-4">
            <p className="text-[var(--color-primary-light)] pokemon-font-small">
              Sign in to save your fusions
            </p>
            <GoogleLoginButton
              onSuccess={handleGoogleLogin}
              onError={() => console.error('Error logging in with Google')}
            />
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-4 mb-8 flex flex-col items-center gap-4 text-center">
            <p className="pokemon-font-large">
              👤 {user?.name}
            </p>
            <p className="text-[var(--color-primary-light)] text-sm font-mono">
              {user?.email}
            </p>
            <ButtonComponent
              text="🚪 Logout"
              variant="primary"
              size="small"
              onClick={handleLogout}
            />
          </div>
        )}
        {/* Featured random fusion */}
        {
          randomFusion ? (
            <div className="w-full flex justify-center">
              <div className="p-6 md:p-8 rounded-lg shadow-2xl shadow-[var(--color-primary-light)] text-center w-full max-w-md border-4 border-[var(--color-primary-light)] bg-[var(--color-primary-dark)]">
                <p className="pokemon-font font-extrabold mb-4 flex justify-center">
                  ✨ Featured Fusion ✨
                </p>

                {/* Fusion image */}
                <div className="cylinder mb-6 flex items-center justify-center border-[var(--color-primary-light)] border-2 rounded-md">
                  <img
                    src={randomFusion.image}
                    alt={randomFusion.name}
                    className="max-w-full h-auto object-contain rounded"
                  />
                </div>

                {/* Fusion name */}
                <h2 className="pokemon-font-small text-lg md:text-xl mb-2">
                  {randomFusion.name}
                </h2>

                {/* Fusion info */}
                <p className="pokemon-font-clean text-xs md:text-sm font-mono mb-2">
                  {randomFusion.pokemon1.toUpperCase()} + {randomFusion.pokemon2.toUpperCase()}
                </p>

                <p className="text-gray-400 text-xs md:text-sm font-mono mb-4">
                  {new Date(randomFusion.createdAt).toLocaleDateString("en-US")}
                </p>

                {/* Button to gallery */}
                <ButtonComponent
                  text="View more in gallery"
                  size="small"
                  variant="header"
                  onClick={() => navigate("/gallery")}
                />
              </div>
            </div>
          ) : (
            // No fusions message
            <div className="w-full flex justify-center">
              <div className="monitor-screen p-8 rounded-lg text-center w-full max-w-md border-4 border-[var(--color-primary-light)] flex flex-col items-center justify-center gap-6">
                <p className="pokemon-font mb-5">
                  [No fusions yet... Create the first one!]
                </p>
                <ButtonComponent
                    text="🔀 Create Fusion"
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
