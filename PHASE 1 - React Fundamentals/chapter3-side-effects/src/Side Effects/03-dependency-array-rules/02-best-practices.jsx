/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
// Dependency Array Best Practices

import { useEffect, useState } from "react";

// Rule 1: Include All Values Used Inside the Effect

// ❌ WRONG - missing dependency
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query).then(setResults);
  }, []); // Missing 'query'!

  return <div>{/* ... */}</div>;
}

// ✅ CORRECT
function SearchResultss({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query).then(setResults);
  }, [query]); // Includes 'query'

  return <div>{/* ... */}</div>;
}

// Rule 2: Use the ESLint Plugin

// Install and configure the React ESLint plugin to catch dependency issues:

// npm install eslint-plugin-react-hooks --save-dev

// .eslintrc.json
// {
//   "plugins": ["react-hooks"],
//   "rules": {
//     "react-hooks/rules-of-hooks": "error",
//     "react-hooks/exhaustive-deps": "warn"
//   }
// }

// Rule 3: Funcitons as Dependencies

// ❌ PROBLEM - function recreated every render
function Component() {
  const [data, setData] = useState(null);

  const fetchData = () => {
    return fetch('/api/data'.then(res => res.json));
  };

  useEffect(() => {
    fetchData().then(setData);
  }, []); // This causes infinite loop!
}

// ✅ SOLUTION 1 - Move function inside effect
function Components() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      return fetch('/api/data').then(res => res.json());
    };

    fetchData().then(setData);
  }, []);
}

// ✅ SOLUTION 2 - Use useCallback
import { useCallback } from 'react';

function Componentss() {
  const [data, setData] = useState(null);

  const fetchData = useCallback(() => {
    return fetch('/api/data').then(res => res.json());
  }, []);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]);
}

// Rule 4: Objects and Arrays as Dependencies

// ❌ PROBLEM - object recreated every render
function Component1() {
  const options = { method: 'GET' }; // New object every render

  useEffect(() => {
    fetch('/api/data', options);
  }, [options]); // Infinite loop!
}

// ✅ SOLUTION 1 - Move inside effect
function Component2() {
  useEffect(() => {
    const options = { method: 'GET' };
    fetch('/api/data', options);
  }, []);
}

// ✅ SOLUTION 2 - Use useMemo
import { useMemo } from 'react';

function Component3() {
  const options = useMemo(() => ({ method: 'GET' }), []);

  useEffect(() => {
    fetch('/api/data', options);
  }, [options]);
}

// ✅ SOLUTION 3 - Use primitive dependencies
function Component4({ method }) {
  useEffect(() => {
    const options = { method };
    fetch('/api/data', options);
  }, [method]); // Only depend on primitive value
}