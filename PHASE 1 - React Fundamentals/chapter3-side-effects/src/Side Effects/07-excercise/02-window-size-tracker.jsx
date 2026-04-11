// Exercise 2: Window Size Tracker

import { useEffect, useState } from "react";

// Track and display the window dimensions.

function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="ml-4">
      Window size: {size.width} x {size.height}
    </div>
  );
}

export default WindowSize;