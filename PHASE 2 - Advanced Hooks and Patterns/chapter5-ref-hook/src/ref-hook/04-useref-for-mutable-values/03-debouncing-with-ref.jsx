// Example 3: Debouncing with Ref

import { useRef, useState } from "react";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);

  const handleSearch = (value) => {
    setSearchTerm(value);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      // Simulate API call
      console.log("Searching for:", value);
      setResults([`Result for "${value}" 1`, `Result for "${value}" 2`]);
    }, 500);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />

      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchInput;
