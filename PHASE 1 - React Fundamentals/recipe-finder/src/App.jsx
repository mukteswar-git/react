import RecipeList from "./components/RecipeList"
import SearchBar from "./components/SearchBar"

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center pt-4">
        Recipe Finder
      </h1>
      <SearchBar />
      <RecipeList />
    </div>
  )
}

export default App