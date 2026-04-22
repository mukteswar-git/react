// Example 1: Basic useImperativeHandle

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const Counter = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  // Exposes only specific methods to parent
  useImperativeHandle(ref, () => ({
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
    reset: () => setCount(0),
    getValue: () => count,
  }));

  return (
    <div style={{ padding: "20px", border: "1px solic #ccc" }}>
      <h2>Count: {count}</h2>
    </div>
  );
});

function Parent() {
  const counterRef = useRef(null);

  const handleIncrement = () => {
    counterRef.current.increment();
  };

  const handleGetValue = () => {
    alert(`Current value: ${counterRef.current.getValue()}`);
  };

  return (
    <div>
      <Counter ref={counterRef} />
      <div className="flex justify-between max-w-md">
        <button
          onClick={handleIncrement}
          className="bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-700"
        >
          Increment from Parent
        </button>
        <button
          onClick={() => counterRef.current.decrement()}
          className="bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-700"
        >
          Decrement
        </button>
        <button
          onClick={() => counterRef.current.reset()}
          className="bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-700"
        >
          Reset
        </button>
        <button
          onClick={handleGetValue}
          className="bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-700"
        >
          Get Value
        </button>
      </div>
    </div>
  );
}

export default Parent;
