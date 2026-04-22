/* eslint-disable react-refresh/only-export-components */
// Basic Example: Toggle Component

import { createContext, useContext, useState } from "react";

// Create context for shared state
const ToggleContext = createContext();

// Main compound component
function Toggle({ children, onToggle }) {
  const [on, setOn] = useState(false);

  const toggle = () => {
    setOn((prev) => {
      const newState = !prev;
      onToggle?.(newState);
      return newState;
    });
  };

  return (
    <ToggleContext.Provider value={{ on, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
}

// Sub-components
Toggle.On = function ToggleOn({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? null : children;
};

Toggle.Button = function ToggleButton({ children, ...props }) {
  const { on, toggle } = useContext(ToggleContext);
  return (
    <button onClick={toggle} {...props}>
      {children || (on ? "ON" : "OFF")}
    </button>
  );
};

Toggle.Status = function ToggleStatus() {
  const { on } = useContext(ToggleContext);
  return <span>The toggle is {on ? "on" : "off"}</span>;
};

// Usage
function App() {
  return (
    <Toggle onToggle={(state) => console.log("Toggled:", state)}>
      <Toggle.Status />
      <Toggle.On>
        <div style={{ background: "green", padding: "20px" }}>
          The button is ON
        </div>
      </Toggle.On>
      <Toggle.Off>
        <div style={{ background: "red", padding: "20px" }}>
          The button is OFF
        </div>
      </Toggle.Off>
    </Toggle>
  );
}
