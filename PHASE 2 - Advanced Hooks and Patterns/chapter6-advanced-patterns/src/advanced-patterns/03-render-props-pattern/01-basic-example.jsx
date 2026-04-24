/* eslint-disable react-refresh/only-export-components */
// Basic Example: Mouse Tracker

import { useState } from "react";

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ height: "100vh", border: "1px solid black" }}
    >
      {render(position)}
    </div>
  );
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          <h1>Move your mouse around!</h1>
          <p>
            Current position: ({x}, {y})
          </p>
          <div
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: "20px",
              height: "20px",
              background: "red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      )}
    />
  );
}
