import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Punto de entrada de React
// Busca el elemento con id="root" en index.html y monta la aplicación ahí
// React.StrictMode activa verificaciones adicionales en desarrollo
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)