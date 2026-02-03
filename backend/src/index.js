/** 
 *  Initial configuration 
 */
require('dotenv').config();             //  Load environment variables
const express = require('express');     //  Import express
const cors = require('cors');           //  Enable communication with frontend

const { googleAuthURL, googleAuthCallback, googleTokenValidation, logout, authMiddleware } = require('./auth.js');    // Import authentication functions
const { generateFusionImage } = require('./generateFusion');  // Import fusion generation function

/**
 *  App creation and port configuration
 */
const app = express();                  //  Create App
const PORT = process.env.PORT;          //  Configure port from environment variables

/**
 * Middlewares
 */
app.use(cors());                    // Enable CORS
app.use(express.json());            // Server understands JSON in requests

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

/**
 * Main route (/)
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
 * Authentication routes (NO protection)
 */
app.get('/api/auth/google', googleAuthURL);         // Start login with Google
app.get('/api/auth/callback', googleAuthCallback);  // Google redirects here with code
app.post('/api/auth/google-token', googleTokenValidation);  // Validate Google token from frontend
app.get('/api/auth/logout', logout);                // Session logout

/**
 * Image generation endpoint (PUBLIC - NO authentication required)
 */
app.post('/api/generate-fusion', async (req, res) => {
  try {
    const { pokemon1Data, pokemon2Data } = req.body;
    
    // Validate required data
    if (!pokemon1Data || !pokemon2Data) {
      return res.status(400).json({ error: 'Missing pokemon data' });
    }
    
    // Generate fusion image
    const result = await generateFusionImage(pokemon1Data, pokemon2Data);
    
    // Return result
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Protect all other /api routes with JWT
 */
app.use('/api', authMiddleware);    // Protect all routes that start with /api AFTER auth

/**
 * Api routes placeholder 
 */
app.get('/api', (req, res) => {
  res.json({ message: 'API routes coming soon' });
});

// Get authenticated user profile
app.get('/api/user/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'User profile',
    user: req.user
  })
});

// Get user fusions from database (to implement)
app.get('/api/user/fusions', authMiddleware, (req, res) =>{
  res.json({
    message: 'User fusions',
    user: req.user.id,
    fusions: [] // Fusions from database
  })
});

/**
 *  CRUD ENDPOINTS - Fusion data management
 */
// GET - Get all fusions from authenticated user
app.get('/api/fusions', authMiddleware, (req, res) =>{
  const userId = req.user.id;

  res.json({
    message: 'User fusions',
    userId: userId,
    fusion: []  // Change this line
  })
});

// POST - Create a new fusion
app.post('/api/fusions', authMiddleware, (req, res) => {
  
  const userId = req.user.id;
  const {name, pokemon1, pokemon2, image} = req.body;

  if (!name || !pokemon1 || !pokemon2 || !image)
      return res.status(400).json({ error: 'Missing required fields' });

  const fusion = {
    id: Date.now().toString(),
    userId: userId,
    name,
    pokemon1,
    pokemon2,
    image, 
    createdAt: new Date().toISOString()
  };
  res.status(201).json({
    message: 'Fusion created successfully',
    fusion
  });
});

// DELETE - Delete an existing fusion
app.delete('/api/fusions/:id', authMiddleware, (req, res) => {

  const fusionId = req.params.id;
  const userId = req.user.id;
  
  res.json({
    message: 'Fusion deleted successfully',
    fusionId: fusionId
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});