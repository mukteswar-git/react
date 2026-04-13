const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <h2 className="font-semibold text-lg line-clamp-2">
          {recipe.title}
        </h2>

        <p className="text-sm text-gray-500">
          Recipe ID: {recipe.id}
        </p>
      </div>
    </div>
  )
}

export default RecipeCard