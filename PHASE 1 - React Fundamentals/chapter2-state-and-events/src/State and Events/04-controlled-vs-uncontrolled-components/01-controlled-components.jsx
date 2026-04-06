// Controlled Components

import { useState } from "react";

function ControlledInput() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="mt-2">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Controlled input"
        className="ml-6 pl-2 border rounded-xs"
      />
      <p className="pl-6 pt-1">You typed: {value}</p>
    </div>
  )
}

// Advantages

// Full control over input value
// Easy to validate in real-time
// Can format/transform input
// Source of truth is React state

export default ControlledInput;