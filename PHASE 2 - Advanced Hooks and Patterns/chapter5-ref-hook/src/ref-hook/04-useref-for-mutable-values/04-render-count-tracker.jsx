/* eslint-disable react-hooks/refs */
// Example 4: Render Count Tracker

import { useRef, useState } from "react";

function RenderCounter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // This increments on every render but doesn't cause re-render
  renderCount.current += 1;

  return (
    <div>
      <h2>State Count: {count}</h2>
      <h3>Component Rendered: {renderCount.current} times</h3>
      <button onClick={() => setCount(count + 1)}>Increment State</button>
    </div>
  );
}

export default RenderCounter;
