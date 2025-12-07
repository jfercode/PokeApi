import { useState, useEffect } from 'react'

interface Pokemon {
  name: string
  url: string
}

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Pokemon[]
}

function PokemonSelector() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch list of Pokémon from PokeAPI
    const fetchPokemon = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon')
        }
        const data: PokemonListResponse = await response.json()
        setPokemonList(data.results)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [])

  const handlePokemonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPokemon(event.target.value)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-2xl p-6 border-4 border-yellow-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🔴 Select Your Pokémon
        </h2>
        
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading Pokémon...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error!</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4">
              <label 
                htmlFor="pokemon-select" 
                className="block text-gray-700 font-semibold mb-2"
              >
                Choose a Pokémon:
              </label>
              <select
                id="pokemon-select"
                value={selectedPokemon}
                onChange={handlePokemonChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-gray-800 cursor-pointer hover:border-yellow-300"
              >
                <option value="">-- Select a Pokémon --</option>
                {pokemonList.map((pokemon) => (
                  <option key={pokemon.name} value={pokemon.name}>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {selectedPokemon && (
              <div className="mt-6 p-4 bg-gradient-to-br from-yellow-100 to-red-100 rounded-lg border-2 border-yellow-400">
                <p className="text-center text-gray-800">
                  <span className="font-semibold">Selected:</span>{' '}
                  <span className="text-xl font-bold text-red-600">
                    {selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1)}
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PokemonSelector
