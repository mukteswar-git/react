// useCallback with Dependencies

import { useCallback, useState } from "react"

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Function recreates only when 'filter' changes
  const handleSearch = useCallback(() => {
    console.log(`Searching for: ${query} with filter: ${filter}`);
    // API call here
  }, [query, filter]); // Recreates when filter changes

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <FilterDropdown onFilterChange={setFilter} />
      <SearchButton onSearch={handleSearch} />
    </div>
  )
}

export default SearchComponent