/**
 * Autenticación OAuth2 con Google - Sistema de Login
 */

/**
 * LIBRERÍAS
 */
const jwt = require("jsonwebtoken");    // Crear y verificar JWT tokens
const axios = require("axios");         // Hacer peticiones HTTP a Google

/**
 * VARIABLES DE CONFIGURACIÓN
 */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;                          // ID de aplicación Google
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;                  // Secret de Google (confidencial)
const JWT_SECRET = process.env.JWT_SECRET;                                      // Clave secreta para firmar tokens
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";                      // Duración del token (7 días por defecto)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";         // URL del servidor Backend
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";       // URL del servidor Frontend

/**
 * FUNCIONES AUXILIARES
 */

// Generar JWT token
const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verificar JWT token
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 *  RUTAS Y CONTROLADORES DE AUTENTICACIÓN
 */

// 1. Ruta para inicio de sesion con Google
//  - Crea una URL de autenticación de Google
//  - Redirige al usuario a Google para que ingrese sus credenciales
const googleAuthUrl = (req, res) => {
  const scopes = "openid profile email";
  const redirectUri = `${BACKEND_URL}/api/auth/callback`;

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}`;

  res.redirect(googleAuthUrl);
};

// 2. Callback después de la autorización de Google
//  - Google devuelve un code después de autorizar
//  - Intercambiamos ese code por un token de Google
//  - Obtenemos los datos del usuario
//  - Generamos nuestro JWT
const googleAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code" });
  }
  try 
  {
    // Intercambiar código por token
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${BACKEND_URL}/api/auth/callback`,
    });

    // Obetner información del usuarion
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { heaeders: { Authorization: `Bearer ${response.data.access_token}` } }
    );

    // Usuario
    const user = 
    {
        id: userResponse.data.id,
        email: userResponse.data.email,
        name: userResponse.data.name
    };

    // Generación del JWT propio
    const token = generateJWT(user);

    // Redirección al frontend
    res.redirect(`${FRONTEND_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);


  } catch (error) {
    console.log("OAuth error: ", error);
    res.redirect(`${FRONTEND_URL}?error=auth_failed`);
  }
};

// 3. Logout
const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
}

/**
 * EXPORTS - Funciones disponibles para otros archivos
 */
module.exports = {
  generateJWT,
  verifyJWT,
  googleAuthCallback,
  googleAuthUrl,
  logout
};
