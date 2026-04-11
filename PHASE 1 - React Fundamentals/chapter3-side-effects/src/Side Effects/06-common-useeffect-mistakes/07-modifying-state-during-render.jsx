/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
// Mistake 7: Modifying State During Render

import { useEffect, useState } from "react";

// ❌ WRONG - Side effect during render
function BadComponent({ data }) {
  const [processed, setProcessed] = useState([]);

  if (data.length > 0) {
    setProcessed(data.map(item => item.toUpperCase()));
    // This causes issues!
  }

  return <div>{processed}</div>;
}

// ✅ CORRECT - Use useEffect
function GoodComponent({ data }) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(data.map(item => item.toUpperCase()));
  }, [data]);

  return <div>{processed}</div>;
}

// ✅ EVEN BETTER - Derive state
function BestComponent({ data }) {
  const processed = data.map(item => item.toUpperCase());
  return <div>{processed}</div>
}