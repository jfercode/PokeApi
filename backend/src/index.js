/** 
 *  Configuración inicial 
 */
require('dotenv').config();             //  Lectura de variables de entorno
const express = require('express');     //  Importa express
const cors = require('cors');           //  Permite la comunicación con el frontend


const { googleAuthURL, googleAuthCallback, logout } = require('./auth');    // Importar funciones de autenticación

/**
 *  Creación de la app y configuración del puerto
 */
const app = express();                  //  Crea App
const PORT = process.env.PORT;          //  Configura puerto desde la variables de entorno

/**
 * Middlewares
 */
app.use(cors());            // Habilita CORS
app.use(express.json());    // El servidor entiende JSON en las peticiones

/**
 * Health check endpoint
 */
// Verificacion del estado del Backend (al acceder a /health)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

/**
 * Ruta principal (/)
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'PokeAPI Backend',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
    }
  });
});

/**
 * Api routes placeholder 
 */
app.get('/api', (req, res) => {
  res.json({ message: 'API routes coming soon' });
});


app.get('/api/auth/google', googleAuthURL);         // Inicia login con Google
app.get('/api/auth/callback', googleAuthCallback);  // Google redirige aqui con el código
app.get('/api/auth/logout', logout);                // Cierre de sesión


// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
