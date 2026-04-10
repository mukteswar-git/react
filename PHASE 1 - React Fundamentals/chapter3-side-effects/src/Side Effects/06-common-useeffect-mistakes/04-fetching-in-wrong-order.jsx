/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// Mistake 4: Fetching in Wrong Order

import { useEffect, useState } from "react";

// ❌ WRONG - Can cause race conditions
function BadSearch({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(setResults); // May set results from old query!
  }, [query]);

  return <div>{/* ... */}</div>
}

// ✅ CORRECT - Use ignore flag or AbortController
function GoodSearch({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let ignore = false;

    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) {
          setResults(data);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  return <div>{/* ... */}</div>;
}