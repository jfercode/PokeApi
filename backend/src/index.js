// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');
const cors = require('cors');

// Import authentication and fusion generation functions
const { googleAuthURL, googleAuthCallback, googleTokenValidation, logout, authMiddleware } = require('./auth.js');
const { generateFusionImage } = require('./generateFusion');

// Initialize Express application
const app = express();
const PORT = process.env.PORT;

// Configure middleware
app.use(cors());                // Enable cross-origin requests
app.use(express.json());        // Parse JSON request bodies

// Health check endpoint for deployment verification
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Main API endpoint - returns general information
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

// Authentication routes - No authentication required
app.get('/api/auth/google', googleAuthURL);                  // Start Google OAuth flow
app.get('/api/auth/callback', googleAuthCallback);           // Google OAuth callback
app.post('/api/auth/google-token', googleTokenValidation);   // Validate Google JWT token
app.get('/api/auth/logout', logout);                         // User logout

// Pokemon fusion generation endpoint - Public (no authentication required)
app.post('/api/generate-fusion', async (req, res) => {
  try {
    const { pokemon1Data, pokemon2Data } = req.body;
    
    // Validate request contains required Pokemon data
    if (!pokemon1Data || !pokemon2Data) {
      return res.status(400).json({ error: 'Missing pokemon data' });
    }
    
    // Generate AI fusion image
    const result = await generateFusionImage(pokemon1Data, pokemon2Data);
    
    // Return fusion result with image URL
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protect all remaining /api routes with JWT authentication middleware
app.use('/api', authMiddleware);

// API routes placeholder
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

// Get user fusions from database (implementation pending)
app.get('/api/user/fusions', authMiddleware, (req, res) =>{
  res.json({
    message: 'User fusions',
    user: req.user.id,
    fusions: []
  })
});

// CRUD Endpoints for Fusion data management

// GET all user fusions
app.get('/api/fusions', authMiddleware, (req, res) =>{
  const userId = req.user.id;

  res.json({
    message: 'User fusions',
    userId: userId,
    fusion: []
  })
});

// POST create a new fusion
app.post('/api/fusions', authMiddleware, (req, res) => {
  
  const userId = req.user.id;
  const {name, pokemon1, pokemon2, image} = req.body;

  // Validate all required fields are present
  if (!name || !pokemon1 || !pokemon2 || !image)
      return res.status(400).json({ error: 'Missing required fields' });

  // Create fusion object
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

// DELETE an existing fusion
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