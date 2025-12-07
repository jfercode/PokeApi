import './App.css'
import PokemonSelector from './PokemonSelector'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-400 flex items-center justify-center p-4">
      {/* Clases de Tailwind explicadas:
          - min-h-screen: altura mínima de pantalla
          - bg-gradient: fondo degradado rojo a amarillo
          - flex items-center justify-center: centra contenido
          - p-4: padding (espacio)
      */}
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">PokeAPI</h1>
        <p className="text-white text-lg mb-8 drop-shadow">Create your custom Pokemon combinations</p>
        
        <PokemonSelector />
      </div>
    </div>
  )
}

export default App
