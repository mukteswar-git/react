// Key Concepts

import { useState } from "react";

// 1. State Declaration

const [state, useState] = useState(initialValue);

  // state: Current value
  // setState: Function to update state
  // initialValue: Starting value (can be any type)

// 2. Multiple State Variables

function UserProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hobbies, setHobbies] = useState([]);

  return <div>{/* component JSX */}</div>;
}

// 3. Different Data Types as State

// String
const [text, setText] = useState('Hello');

// Number
const [count, setCount] = useState(0);

// Boolean
const [isVisible, setIsVisible] = useState(true);

// Array
const [items, setItems] = useState([]);

// Object
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
});

// Null/Undefined
const [data, setData] = useState(null);

// 4. Lazy Initialization

function ExpensiveComponent() {
  // ❌ Bad: Rurns on every render
  const [states, setStates] = useState(computeExpensiveValue());

  // ✅ Good: Runs only once
  const [state, setState] = useState(() => {
    return computeExpensiveValue();
  });

  return <div>{state}</div>
}

// 5. Functional Updates

function Counter() {
  const [count, setCount] = useState(0);

  // ❌ May cause issues with rapid updates
  const increment = () => setCount(count + 1);

  // ✅ Always uses latest state
  const incrementSafe = () => setCount(prevCount => prevCount + 1);

  // Example with multiple clicks
  const incrementThreeTimes = () => {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
    // Correctly adds 3
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementSafe}>Increment</button>
      <button onClick={incrementThreeTimes}>+3</button>
    </div>
  )
}