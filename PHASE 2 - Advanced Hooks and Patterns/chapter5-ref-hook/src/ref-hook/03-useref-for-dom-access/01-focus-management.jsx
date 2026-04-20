// Example 1: Focus Management

import { useEffect, useRef } from "react";

function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input on component mount
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="This input is auto-focused"
        className="mt-4 ml-4 py-1 px-2 border rounded focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default AutoFocusInput;
