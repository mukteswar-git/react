// Example 3: Measuring DOM Elements

import { useRef, useState } from "react";

function MeasureElement() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const measureElement = () => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  };

  return (
    <div className="ml-4 mt-4">
      <div ref={divRef} className="h-64 w-72 p-5 bg-sky-800">
        <p>Resize the window and click the button!</p>
      </div>

      {dimensions.width > 0 && (
        <p className="mt-2">
          Dimensions: {dimensions.width.toFixed(2)}px x{" "}
          {dimensions.height.toFixed(2)}px
        </p>
      )}

      <button
        onClick={measureElement}
        className="px-2 py-1 bg-sky-950 hover:bg-sky-900 rounded mt-4"
      >
        Measure Element
      </button>
    </div>
  );
}

export default MeasureElement;
