// Without useCallback

import React, { useCallback, useState } from "react";

/**
const BasicExample = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // This function is recreated on every render
  const handleClick = () => {
    console.log('Button clicked')
  };

  return (
    <div>
      <input 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <ChildComponent onClick={handleClick} />
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}


const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent rendered');
  return <button onClick={onClick}>Click Me</button>
}); **/

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // Function is only created once
  const handleClick = useCallback(() => {
    console.log("Button Clicked");
  }, []); // Empty dependency array

  return (
    <div className="ml-4 flex flex-col gap-6 max-w-md">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border-2 rounded px-1"
      />
      <ChildComponent onClick={handleClick} />
      <button
        onClick={() => setCount(count + 1)}
        className="bg-gray-600 py-1 rounded-md"
      >
        Count: {count}
      </button>
    </div>
  );
};

const ChildComponent = React.memo(({ onClick }) => {
  console.log("ChildComponent rendered");
  return (
    <button onClick={onClick} className="bg-gray-600 py-1 rounded-md">
      Click me
    </button>
  );
});

export default ParentComponent;
