// Exercise 1: Counter with Multiple Operations
// Create a counter that can:

import { useState } from "react";

// Increment by 1
// Decrement by 1
// Increment by 5
// Reset to 0
// Set to a custom value

function Counter() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const incrementBy1 = () => {
    setCount(c => c + 1);
  };

  const decrementBy1 = () => {
    setCount(c => c - 1);
  };

  const incrementBy5 = () => {
    setCount(c => c + 5);
  };

  const resetTo0 = () => {
    setCount(0);
  };

  const setCustomValue = () => {
    setCount(Number(inputValue));
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={incrementBy1}>+1</button>
      <button onClick={decrementBy1}>-1</button>
      <button onClick={incrementBy5}>+5</button>
      <button onClick={resetTo0}>Reset to 0</button>

      <input 
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <button onClick={setCustomValue}>Set</button>
    </div>
  )
}

export default Counter;