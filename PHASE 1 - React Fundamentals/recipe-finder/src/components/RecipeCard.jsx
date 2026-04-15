const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
      <img 
        src={recipe.strMealThumb} 
        alt={recipe.strMeal} 
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <h2 className="font-semibold text-lg line-clamp-2">
          {recipe.strMeal}
        </h2>

        <p className="text-sm text-gray-500">
          Recipe ID: {recipe.idMeal}
        </p>
      </div>
    </div>
  )
}

export default RecipeCard