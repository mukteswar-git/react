import { useEffect, useState } from "react"
import RecipeList from "./components/RecipeList"
import SearchBar from "./components/SearchBar"
import Loader from "./components/Loader"

const App = () => {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!searchTerm.trim()) return

    const fetchRecipes = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
        )

        if (!res.ok) {
          throw new Error("API request failed")
        }

        const data = await res.json()
        setRecipes(data.meals || [])
      } catch (err) {
        console.error("Error fetching recipes:", err)
        setError(err.message || "Failed to fetch recipes")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center pt-4">
        Recipe Finder
      </h1>

      <SearchBar 
        query={query}
        setQuery={setQuery}
        setSearchTerm={setSearchTerm}
      />

      {loading && <Loader />}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}

      {!loading && !error && recipes.length === 0 && searchTerm && (
        <p>No recipes found</p>
      )}

      <RecipeList recipes={recipes} />
    </div>
  )
}

export default App