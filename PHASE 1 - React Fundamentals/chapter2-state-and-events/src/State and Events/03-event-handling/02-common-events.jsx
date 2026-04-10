/* eslint-disable react-refresh/only-export-components */
// Common Events

import { useState } from "react";

function EventTypes() {
  const [status, setStatus] = useState('');

  return (
    <div>
      {/* Click Events */}
      <button onClick={() => setStatus('Clicked')}>Click</button>
      <button onDoubleClick={() => setStatus('Double Clicked')}>
        Double Click
      </button>

      {/* Mouse Events */}
      <div 
        onMouseEnter={() => setStatus('Mouse Entered')}
        onMouseLeave={() => setStatus('Mouse Left')}
        onMouseMove={() => setStatus('Mouse Moving')}
      >
        Hover over me 
      </div>

      {/* Keyboard Events */}
      <input 
        onKeyDown={(e) => setStatus(`Key Down: ${e.key}`)}
        onKeyUp={(e) => setStatus(`Key Up: ${e.key}`)}
        onKeyPress={(e) => setStatus(`Key Press: ${e.key}`)}
        placeholder="Type something"
      />

      {/* Focus Events */}
      <input
        onFocus={() => setStatus('Focused')}
        onBlur={() => setStatus('Blurred')}
        placeholder="Focus me"
      />

      {/* Form Events */}
      <input
        onChange={(e) => setStatus(`Changed: ${e.target.value}`)}
        placeholder="Type to see change"
      />

      <form onSubmit={(e) => {
        e.preventDefault();
        setStatus('Form Submitted');
      }}>
        <button type="submit">Submit</button>
      </form>

      <p>Status: {status}</p>
    </div>
  )
}