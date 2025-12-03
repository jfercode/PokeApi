import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ===== MIDDLEWARE =====
app.use(cors())
app.use(express.json())

// ===== ROUTES =====

// GET / - Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'PokeAPI Backend API' })
})

// GET /health - Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend is running',
    timestamp: new Date().toISOString()
  })
})

// 404 - Not found
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})