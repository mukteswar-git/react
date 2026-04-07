// Automatic Batching (React 18+)

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  console.log('Render!'); // Will only log once per click

  const handleClick = () => {
    // These are batched - only one re-render
    setCount(c => c + 1);
    setFlag(f => !f);
    // Component re-renders once with both updates
  };

  const handleClickAsync = async () => {
    // Even in async functions, these are batched in React 18+
    await fetch('/api');
    setCount(c => c + 1);
    setFlag(f => !f);
    // Still only one re-render!
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Flag: {flag.toString}</p>
      <button onClick={handleClick}>Update</button>
      <button onClick={handleClickAsync}>Update Async</button>
    </div>
  );
}