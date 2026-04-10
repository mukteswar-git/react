/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
// Mistake 2: Missing Dependencies

// ❌ WRONG - Stale closure
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // Always uses initial count value!
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Missing 'count' dependency

  return <div>{count}</div>;
}

// ✅ CORRECT - Use functional update
function Counters() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1); // Uses latest count
    }, 1000);

    return () => clearInterval(interval);
  }, []); // No dependencies needed!

  return <div>{count}</div>;
}