// Example 1: Basic forwardRef

import { forwardRef, useRef } from "react";

// Child component with forwardRef
const FancyInput = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      className="fancy-input"
      style={{
        padding: "10px",
        border: "2px solid blue",
        borderRadius: "5px",
      }}
      {...props}
    />
  );
});

// Parent component
function ParentComponent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <FancyInput ref={inputRef} placeholder="Type here..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

export default ParentComponent;
