// Basic Custom Hook Example

import { useState } from "react";

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + step);
  const decrement = () => setCount((prev) => prev - step);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Usage
function CreateComponent() {
  const { count, increment, decrement, reset } = useCounter(0, 5);

  return (
    <div>
      <h2 className="mt-4">Count: {count}</h2>
      <button onClick={increment} className="bg-gray-800 px-2 py-1 rounded-lg hover:bg-gray-700 mt-4">+5</button>
      <button onClick={decrement} className="bg-gray-800 px-2 py-1 rounded-lg hover:bg-gray-700 ml-4 mt-4">-5</button>
      <button onClick={reset} className="bg-gray-800 px-2 py-1 rounded-lg hover:bg-gray-700 ml-4 mt-4">Reset</button>
    </div>
  );
}

export default CreateComponent;
