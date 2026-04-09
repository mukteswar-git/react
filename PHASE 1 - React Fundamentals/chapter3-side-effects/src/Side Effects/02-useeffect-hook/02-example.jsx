// Example 2: Logging User Actions

import { useEffect, useState } from "react";

function UseTracker() {
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    console.log('User has clicked:', clicks, 'times');
    // Could send analytical data here
  }, [clicks]);

  return (
    <button 
      onClick={() => setClicks(clicks + 1)}
      className="mt-4 ml-4 px-2 py-1 rounded-sm bg-gray-600"
    >
      Clicked {clicks} times
    </button>
  )
}

export default UseTracker;