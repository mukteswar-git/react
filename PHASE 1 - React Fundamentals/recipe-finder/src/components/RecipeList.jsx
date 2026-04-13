import RecipeCard from "./RecipeCard"

const RecipeList = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {recipes.map((item) => (
        <RecipeCard key={item.id} recipe={item} />
      ))}
    </div>
  )
}

export default RecipeList