import { useState } from "react";

function BasicSyntaxCounter() {
  // [stateValue, setterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);

  return (
    <div className="pl-6">
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="p-1 px-2 bg-gray-600 rounded-xs mt-2"
      >
        Increment
      </button>
    </div>
  );
}

export default BasicSyntaxCounter;