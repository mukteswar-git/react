/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
// Mistake 1: Infinite Loops

// Infinite loop

function BadComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // Updates state every render
  }); // No dependency array!

  return <div>{count}</div>;
}

// ✅ CORRECT
function GoodComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array

  return <div>{count}</div>;
}