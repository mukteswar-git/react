/* eslint-disable no-undef */
/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// Strategy 1: Component Splitting

// Problem: Large component re-renders everything

// ❌ Bad - entire component re-renders
function Dashboard() {
  const [time, setTime] = useState(Date.now());
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <p>Current time: {new Date(time).toLocaleTimeString()}</p>
      </header>
      <ExpensiveChart data={data} />
      <ExpensiveTable data={data} />
      <ExpensiveMap data={data} />
    </div>
  );
}

// Solution: Split into smaller components

// ✅ Good - only Clock re-renders
function Dashboards() {
  const [data, setData] = useState([]);

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <Clock />
      </header>
      <ExpensiveChart data={data} />
      <ExpensiveTable data={data} />
      <ExpensiveMap data={data} />
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <p>Current time: {new Date(time).toLocaleTimeString()}</p>;
}