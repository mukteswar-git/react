const SearchBar = ({ setSearchTerm, query, setQuery}) => {
  const handleSearch = () => {
    setSearchTerm(query)
  }

  return (
    <div className="flex gap-2 justify-center mt-6">
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes..." 
        className="border p-2 rounded w-64"
      />
      <button 
        onClick={handleSearch}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar