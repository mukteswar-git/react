/* eslint-disable react-refresh/only-export-components */
// Opting Out of Batching (Rare Cases)

import { useState } from 'react';
import { flushSync } from 'react-dom';

function FlushSyncExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleClick = () => {
    // Force synchronous update
    flushSync(() => {
      setCount(c => c + 1);
    });
    // count is updated and component has re-rendered

    // This will be in a separate render
    setText('Updated');
  };

  // Note: flushSync should be used sparingly
  // Only: when you need immediate DOM updates

  return (
    <div>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <button onClick={handleClick}>Update</button>
    </div>
  );
}