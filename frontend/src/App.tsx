import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-400 flex items-center justify-center p-4">
      {/* Clases de Tailwind explicadas:
          - min-h-screen: altura mínima de pantalla
          - bg-gradient: fondo degradado rojo a amarillo
          - flex items-center justify-center: centra contenido
          - p-4: padding (espacio)
      */}
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">PokeAPI</h1>
        <p className="text-gray-600 mb-6">Create your custom Pokemon combinations</p>
        <div className="animate-bounce">
          <span className="text-5xl">🔴</span>
        </div>
      </div>
    </div>
  )
}

export default App
