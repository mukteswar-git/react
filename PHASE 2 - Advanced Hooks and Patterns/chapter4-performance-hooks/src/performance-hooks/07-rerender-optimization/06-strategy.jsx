/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
// Strategy 6: Debouncing and Throttling

import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      const data = await fetchResults(searchQuery);
      setResults(data);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <ResultsList results={results} />
    </div>
  );
}
