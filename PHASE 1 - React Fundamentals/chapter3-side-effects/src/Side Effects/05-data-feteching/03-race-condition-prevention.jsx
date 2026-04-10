// Race Condition Prevention

import { useEffect, useState } from "react";

function SearchResult({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Prevent race conditions with a flag
    let ignore = false;

    const fetchResult = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();

        // Only update if this is still the latest request
        if (!ignore) {
          setResults(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Search failed:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (query) {
      fetchResult();
    } else {
      setResults([]);
      setLoading(false);
    }

    // Cleanup: mark this request as stale
    return () => {
      ignore = true;
    };
  }, [query]);

  return(
    <div>
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResult;