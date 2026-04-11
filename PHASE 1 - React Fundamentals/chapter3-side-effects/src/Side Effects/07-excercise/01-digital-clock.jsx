// Exercise 1: Digital Clock

import { useEffect, useState } from "react";

// Create a digital clock that updates every second.

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="p-2 ml-2 mt-4">
      {hours}:{minutes}:{seconds}
    </div>
  )
}

export default DigitalClock;