const RecipeCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-64">
      <img 
        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" 
        alt="recipe" 
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <h2 className="font-semibold text-lg">Recipe Title</h2>
        <p className="text-sm text-gray-500">Category</p>
      </div>
    </div>
  )
}

export default RecipeCard