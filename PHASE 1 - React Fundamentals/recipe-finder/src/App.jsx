import { useState } from "react"
import RecipeList from "./components/RecipeList"
import SearchBar from "./components/SearchBar"

const App = () => {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [recipes, setRecipes] = useState([])

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

      <RecipeList recipes={recipes} />
    </div>
  )
}

export default App