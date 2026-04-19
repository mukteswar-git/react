/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
// Strategy 3: Composition with Children

// ❌ Bad - ExpensiveComponent re-renders with count
function Container() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent />
    </div>
  );
}

// ✅ Good - ExpensiveComponent never re-renders
function App() {
  return (
    <Container>
      <ExpensiveComponent />
    </Container>
  );
}

function Containers({ children }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {children}
    </div>
  );
}