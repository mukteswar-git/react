import RecipeCard from "./RecipeCard"

const RecipeList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      <RecipeCard />
      <RecipeCard />
      <RecipeCard />
      <RecipeCard />
    </div>
  )
}

export default RecipeList