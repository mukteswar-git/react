/* eslint-disable react-hooks/immutability */
/* eslint-disable react-refresh/only-export-components */
// Why Immutability Matters

import { useState } from "react";

// ❌ WRONG - Direct Mutation
function WrongWay() {
  const [user, setUser] = useState({ name: 'John', age: 30 });

  const updateAge = () => {
    user.age = 31; // Direct mutation - React won't detect this!
    setUser(user); // Same reference, no re-render
  };

  return <button onClick={updateAge}>Update Age</button>
}

// ✅ CORRECT - Immutable Update
function CorrectWay() {
  const [user, setUser] = useState({ name: 'John', age: 30 });

  const updateAge = () => {
    setUser({ ...user, age:31 }); // new object, triggers re-render
  };

  return <button onClick={updateAge}>Update Age</button>;
}