// Example 2: forwardRef with Custom Components

import { forwardRef, useRef } from "react";

const CustomButton = forwardRef(
  ({ children, variant = "primary", ...props }, ref) => {
    const styles = {
      primary: { background: "blue", color: "white" },
      secondary: { background: "gray", color: "white" },
      danger: { background: "red", color: "white" },
    };

    return (
      <button
        ref={ref}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          ...styles[variant],
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

function App() {
  const buttonRef = useRef(null);

  const handleClick = () => {
    // Access button methods/properties
    buttonRef.current.blur();
    console.log("Button width:", buttonRef.current.offsetWidth);
  };

  return (
    <div>
      <CustomButton ref={buttonRef} variant="primary" onClick={handleClick}>
        Click Me
      </CustomButton>
    </div>
  );
}

export default App;
