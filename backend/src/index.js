/** 
 *  Configuración inicial 
 */
require('dotenv').config();             //  Lectura de variables de entorno
const express = require('express');     //  Importa express
const cors = require('cors');           //  Permite la comunicación con el frontend

const { googleAuthURL, googleAuthCallback, googleTokenValidation, logout, authMiddleware } = require('./auth.js');    // Importar funciones de autenticación

/**
 *  Creación de la app y configuración del puerto
 */
const app = express();                  //  Crea App
const PORT = process.env.PORT;          //  Configura puerto desde la variables de entorno

/**
 * Middlewares
 */
app.use(cors());                    // Habilita CORS
app.use(express.json());            // El servidor entiende JSON en las peticiones

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
 * Rutas de Autenticación (SIN protección)
 */
app.get('/api/auth/google', googleAuthURL);         // Inicia login con Google
app.get('/api/auth/callback', googleAuthCallback);  // Google redirige aqui con el código
app.post('/api/auth/google-token', googleTokenValidation);  // Validar token de Google desde frontend
app.get('/api/auth/logout', logout);                // Cierre de sesión

/**
 * Proteger todas las demás rutas /api con JWT
 */
app.use('/api', authMiddleware);    // Proteger todas las rutas que empiezan con /api DESPUÉS de auth

/**
 * Api routes placeholder 
 */
app.get('/api', (req, res) => {
  res.json({ message: 'API routes coming soon' });
});

// Obtención de perfil de usuario autentificado
app.get('/api/user/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'User profile',
    user: req.user
  })
});

// Fusiones del usuario obtenidas de la db (a implementar)
app.get('/api/user/fusions', authMiddleware, (req, res) =>{
  res.json({
    message: 'User fusions',
    user: req.user.id,
    fusions: [] // Fusiones de la db 
  })
});

/**
 *  CRUD ENDPOINTS - Gestión de datos de las Fusiones
 */
// GET - Obtencion de todas las fusiones del usuario autenticado
app.get('/api/fusions', authMiddleware, (req, res) =>{
  // TODO Obtener de la db
  res.json({
    message: 'User fusions',
    userId: req.user.id,
    fusion: []  // cambiar esta linea
  })
});

// POST - Crear una nueva fusión 
app.post('/api/fusions', authMiddleware, (req, res) => {
  const {name, pokemon1, pokemon2, image} = req.body;

  if (!name || !pokemon1 || !pokemon2 || !image)
      return res.status(400).json({ error:' Missing required fields' });

  const fusion = {
    id: Date.now().toString(),
    userId: req.user.id,
    name,
    pokemon1, pokemon2, image, 
    createAt: new Date().toISOString()
  };
  res.status(201).json({
    message: 'Fusion created succssfully',
    fusion
  });
});

// DELETE - Eliminar una fusion existente
app.delete('/api/fusions/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  // TODO Eliminar de la DB
  res.json({
    message: 'Fussion deleted successfully',
    fusionId: id
  });
});



// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
