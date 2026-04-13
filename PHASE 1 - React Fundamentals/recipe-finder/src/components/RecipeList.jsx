import RecipeCard from "./RecipeCard"

const RecipeList = ({ recipes }) => {
  if (recipes.length === 0) {
    return <p className="text-center mt-6">No recipies found</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {recipes.map((item) => (
        <RecipeCard key={item.recipe.uri} recipe={item.recipe} />
      ))}
    </div>
  )
}

export default RecipeList