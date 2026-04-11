/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
// Mistake 6: Incorrect Dependencies with Objects

import { useEffect } from "react";

// ❌ WRONG - Object reference changes every render
function BadComponent() {
  const user = { name: 'John', age: 30 };

  useEffect(() => {
    console.log('User changed:', user);
  }, [user]); // Runs every render!
}

// ✅ CORRECT - Depend on specific properties
function GoodComponent() {
  const user = { name: 'John', age: 30 };

  useEffect(() => {
    console.log('User change:', user);
  }, [user.name, user.age])
}