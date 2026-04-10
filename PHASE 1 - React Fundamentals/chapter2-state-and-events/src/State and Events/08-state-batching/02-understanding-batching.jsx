/* eslint-disable react-refresh/only-export-components */
// Understanding Batching

import { useState } from "react";

function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);

  console.log('Component rendered');

  const handleMultipleUpdates = () => {
    console.log('Starting updates...');

    // All these updates are batched
    setCount(c => c + 1);
    setText('Updated');
    setItems([1, 2, 3]);

    console.log('Updates queued');
    // Component renders once after this function completes
  };

  const handleSequentialReads = () => {
    // Be careful: state updates are asynchronous
    setCount(c => c + 1);
    console.log(count); // Still shows OLD value!

    // Use functional update to get latest
    setCount(c => {
      console.log('Latest count:', c + 1);
      return c + 1;
    });
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Test: {text}</p>
      <p>Items: {items.join(', ')}</p>

      <button onClick={handleMultipleUpdates}>
        Multiple Updates (1 render)
      </button>
      <button onClick={handleSequentialReads}>
        Sequential Reads 
      </button>
    </div>
  );
}