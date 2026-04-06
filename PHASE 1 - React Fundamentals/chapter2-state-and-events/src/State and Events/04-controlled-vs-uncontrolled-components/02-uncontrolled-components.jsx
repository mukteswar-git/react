// Uncontrolled Components

import { useRef } from "react";

function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Input value:', inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit} className="pl-6 mt-2">
      <input 
        type="text"
        ref={inputRef}
        defaultValue="Initial value"
        placeholder="Uncontrolled input"
        className="pl-2 border rounded-xs mb-2"
      />
      <button type="submit" className="bg-gray-600 px-2 rounded-xs">Submit</button>
    </form>
  )
}

export default UncontrolledInput;