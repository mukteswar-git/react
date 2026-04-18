/* eslint-disable no-empty */
// Basic example

import { useMemo, useState } from "react"

// Without useMemo:

/**function ExpensiveComponent({ items }) {
  const [count, setCount] = useState(0);

  // This expensive calculation runs on EVEFY render
  const expensiveCalculation = items.reduce((acc, item) => {
    // Simulate expensive operation
    for (let i = 0; i < 1000000; i++) {}
    return acc + item.value;
  }, 0);

  return (
    <div>
      <p>Total: {expensiveCalculation}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
    </div>
  )
}**/

const ExpensiveComponent = ({ items }) => {
  const [count, setCount] = useState(0);

  // Calculation only runs when 'items' changes
  const expensiveCalculation = useMemo(() => {
    console.log('Calculating...');
    return items.reduce((acc, item) => {
      for (let i = 0; i < 1000000; i++) {}
      return acc + item.value;
    }, 0);
  }, [items]); // Only recalculate when items change

  return (
    <div>
      <p>Total: {expensiveCalculation}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
    </div>
  )
}

export default ExpensiveComponent