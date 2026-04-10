/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// Event Handling Best Practices

import { useState } from "react";

function BestPractices() {
  const [count, setCount] = useState(0);

  // ✅ Good: Define handler outside JSX
  const handleIncrement = () => {
    setCount(c => c + 1);
  };

  // ✅ Good: Use useCallback for optimization 
  const handleDecrement = () => {
    setCount(c => c - 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      {/* ✅ Good: Reference to function */}
      <button onClick={handleIncrement}>+</button>

      {/* ⚠️ Okay for simple cases */}
      <button onClick={() => setCount(c => c -1)}>-</button>

      {/* ❌ Bad: Creates new function on every render */}
      <button onClick={() => {
        console.log('Doing many things...');
        setCount(c => c + 1);
      }}>
        Complex Operation
      </button>
    </div>
  );
}