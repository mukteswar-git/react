// Three Patterns

import { useEffect } from "react";

// 1. No Dependency Array(Run on Every Render)

  useEffect(() => {
    console.log('This runs after EVERY render');
  });

  // Use case: Rarely needed, usually indicates a code smell.

// 2. Empty Dependency Array (Run Once)

  useEffect(() => {
    console.log('This runs only once after initial render');
  }, []);

  // Use cases:
  //  - Initial data fetching
  //  - Setting up subscriptions
  //  - One-time initialization

// 3. With Dependencies (Run When Dependency Change)

  useEffect(() => {
    console.log('This runs when count or name changes');
  }, [count, name]);

  // Use cases:
  //  - Syncing with external systems based on props or state
  //  - Re-fetching data when parameters change