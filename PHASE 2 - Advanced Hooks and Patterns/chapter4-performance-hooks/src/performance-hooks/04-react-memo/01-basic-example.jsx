/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// Basic Example

import React, { useState } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ChildComponent name={name} />
    </div>
  );
}

// Without React.memo:
/**function ChildComponent({ name }) {
  console.log('ChildComponent rendered');
  return <div>Hello, {name}!</div>;
}**/
// ChildComponent re-renders even when only 'count' changes

// With React.memo:
const ChildComponent = React.memo(({ name }) => {
  console.log('ChildComponent rendered');
  return <div>Hello, {name}!</div>
})
// Now only re-renders when 'name' changes