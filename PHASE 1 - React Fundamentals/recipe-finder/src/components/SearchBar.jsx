const SearchBar = () => {
  return (
    <div className="flex gap-2 justify-center mt-6">
      <input 
        type="text" 
        placeholder="Search recipes..." 
        className="border p-2 rounded w-64"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  )
}

export default SearchBar