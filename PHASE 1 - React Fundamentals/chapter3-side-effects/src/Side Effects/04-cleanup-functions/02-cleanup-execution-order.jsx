// Cleanup Execution Order

import { useEffect } from "react";

function EffectDemo({ id }) {
  useEffect(() => {
    console.log('1. Effect runs for id:', id);

    return () => {
      console.log('2. Cleanup runs for id:', id);
    };
  }, [id]);

  return <div>ID: {id}</div>;
}

export default EffectDemo;

// When id changes from 1 to 2:
// Output:
// "1. Effect runs for id: 1"
// (user changes id to 2)
// "2. Cleanup runs for id: 1"  <- cleanup of old effect
// "1. Effect runs for id: 2"   <- new effect 