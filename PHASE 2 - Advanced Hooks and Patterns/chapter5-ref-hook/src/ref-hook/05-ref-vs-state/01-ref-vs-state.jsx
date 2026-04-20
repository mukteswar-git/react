/* eslint-disable react-hooks/refs */
// Difference Between Ref and State

import { useRef, useState } from "react";

function StateVsRef() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);

  const incrementState = () => {
    setStateCount(stateCount + 1);
    console.log("State after setState:", stateCount); // Shows old value!
  };

  const incrementRef = () => {
    refCount.current += 1;
    console.log("Ref after icrement:", refCount.current); // Shows new value!
    // Component won't re-render!
  };

  return (
    <div className="flex flex-col max-w-sm gap-4">
      <h2 className="text-center">State Count: {stateCount}</h2>
      <h3 className="text-center">Ref Count: {refCount.current}</h3>

      <button
        onClick={incrementState}
        className="bg-gray-700 px-2 py-0.5 rounded"
      >
        Increment State (Re-renders)
      </button>

      <button
        onClick={incrementRef}
        className="bg-gray-700 px-2 py-0.5 rounded"
      >
        Increment Ref (No Re-render)
      </button>
    </div>
  );
}

export default StateVsRef;
