// Example 2: Interval ID Storage

import { useEffect, useRef, useState } from "react";

function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCount((c) => c + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleReset = () => {
    setCount(0);
    setIsRunning(false);
  };

  return (
    <div>
      <h1>Timer: {count}s</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Timer;
