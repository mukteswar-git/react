# React Performance Hooks Tutorial

## Day 8-10: Mastering Performance Optimization

---

## Table of Contents

1. [Introduction to Performance Optimization](#introduction)
2. [useCallback Hook](#usecallback)
3. [useMemo Hook](#usememo)
4. [React.memo for Component Memoization](#reactmemo)
5. [When to Use Performance Hooks (and When NOT to)](#when-to-use)
6. [Profiling with React DevTools](#profiling)
7. [Re-render Optimization Strategies](#optimization-strategies)
8. [Practical Examples](#practical-examples)
9. [Common Pitfalls](#common-pitfalls)
10. [Best Practices](#best-practices)

---

## Introduction to Performance Optimization {#introduction}

React is fast by default, but as applications grow, you may encounter performance bottlenecks. React provides several tools to optimize performance:

- **useCallback**: Memoizes functions
- **useMemo**: Memoizes computed values
- **React.memo**: Memoizes components

### When Does Performance Matter?

Before optimizing, ask yourself:

- Is there a noticeable lag or slowdown?
- Are you rendering large lists (100+ items)?
- Do you have expensive calculations?
- Are components re-rendering unnecessarily?

**Golden Rule**: Don't optimize prematurely. Measure first, then optimize.

---

## useCallback Hook {#usecallback}

### What is useCallback?

`useCallback` returns a memoized version of a callback function that only changes if one of its dependencies has changed.

### Syntax

```javascript
const memoizedCallback = useCallback(
  () => {
    // Your function logic
  },
  [dependencies]
);
```

### Basic Example

**Without useCallback:**

```javascript
import React, { useState } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // This function is recreated on every render
  const handleClick = () => {
    console.log('Button clicked');
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
  return <button onClick={onClick}>Click me</button>;
});
```

**Problem**: Even though `ChildComponent` is wrapped in `React.memo`, it re-renders when `text` changes because `handleClick` is recreated each time.

**With useCallback:**

```javascript
import React, { useState, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Function is only created once
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Empty dependency array

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
  return <button onClick={onClick}>Click me</button>;
});
```

**Result**: `ChildComponent` only renders when it needs to, not when `text` changes.

### useCallback with Dependencies

```javascript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Function recreates only when 'filter' changes
  const handleSearch = useCallback(() => {
    console.log(`Searching for: ${query} with filter: ${filter}`);
    // API call here
  }, [filter]); // Recreates when filter changes

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <FilterDropdown onFilterChange={setFilter} />
      <SearchButton onSearch={handleSearch} />
    </div>
  );
}
```

### Real-World Example: Event Handlers

```javascript
import React, { useState, useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
  ]);

  // Memoized toggle function
  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // No dependencies needed

  // Memoized delete function
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}

const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem ${todo.id} rendered`);
  
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});
```

---

## useMemo Hook {#usememo}

### What is useMemo?

`useMemo` returns a memoized value that only recalculates when dependencies change. Use it for expensive computations.

### Syntax

```javascript
const memoizedValue = useMemo(
  () => {
    // Expensive calculation
    return computedValue;
  },
  [dependencies]
);
```

### Basic Example

**Without useMemo:**

```javascript
function ExpensiveComponent({ items }) {
  const [count, setCount] = useState(0);

  // This expensive calculation runs on EVERY render
  const expensiveCalculation = items.reduce((acc, item) => {
    // Simulate expensive operation
    for (let i = 0; i < 1000000; i++) {}
    return acc + item.value;
  }, 0);

  return (
    <div>
      <p>Total: {expensiveCalculation}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
    </div>
  );
}
```

**With useMemo:**

```javascript
function ExpensiveComponent({ items }) {
  const [count, setCount] = useState(0);

  // Calculation only runs when 'items' changes
  const expensiveCalculation = useMemo(() => {
    console.log('Calculating...');
    return items.reduce((acc, item) => {
      for (let i = 0; i < 1000000; i++) {}
      return acc + item.value;
    }, 0);
  }, [items]); // Only recalculate when items change

  return (
    <div>
      <p>Total: {expensiveCalculation}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
    </div>
  );
}
```

### Practical Examples

#### 1. Filtering and Sorting Large Lists

```javascript
function UserList({ users, searchTerm, sortBy }) {
  // Memoize filtered and sorted users
  const processedUsers = useMemo(() => {
    console.log('Processing users...');
    
    // Filter
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'age') {
        return a.age - b.age;
      }
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortBy]);

  return (
    <ul>
      {processedUsers.map(user => (
        <li key={user.id}>{user.name} - {user.age}</li>
      ))}
    </ul>
  );
}
```

#### 2. Complex Calculations

```javascript
function ProductCalculator({ products, taxRate, discount }) {
  const summary = useMemo(() => {
    const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * (taxRate / 100);
    const total = afterDiscount + tax;

    return { subtotal, discountAmount, tax, total };
  }, [products, taxRate, discount]);

  return (
    <div>
      <p>Subtotal: ${summary.subtotal.toFixed(2)}</p>
      <p>Discount: -${summary.discountAmount.toFixed(2)}</p>
      <p>Tax: ${summary.tax.toFixed(2)}</p>
      <p>Total: ${summary.total.toFixed(2)}</p>
    </div>
  );
}
```

#### 3. Memoizing Object/Array References

```javascript
function DataComponent({ id }) {
  const [count, setCount] = useState(0);

  // Without useMemo, this object is recreated every render
  const config = useMemo(() => ({
    id,
    timestamp: Date.now(),
    options: {
      cache: true,
      retry: 3
    }
  }), [id]);

  return (
    <div>
      <ExpensiveChildComponent config={config} />
      <button onClick={() => setCount(count + 1)}>
        Re-render: {count}
      </button>
    </div>
  );
}
```

---

## React.memo for Component Memoization {#reactmemo}

### What is React.memo?

`React.memo` is a higher-order component that memoizes a component, preventing re-renders if props haven't changed.

### Syntax

```javascript
const MemoizedComponent = React.memo(Component, arePropsEqual?);
```

### Basic Example

**Without React.memo:**

```javascript
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ChildComponent name={name} />
    </div>
  );
}

function ChildComponent({ name }) {
  console.log('ChildComponent rendered');
  return <div>Hello, {name}!</div>;
}
// ChildComponent re-renders even when only 'count' changes
```

**With React.memo:**

```javascript
const ChildComponent = React.memo(({ name }) => {
  console.log('ChildComponent rendered');
  return <div>Hello, {name}!</div>;
});
// Now only re-renders when 'name' changes
```

### Custom Comparison Function

```javascript
const UserCard = React.memo(
  ({ user, theme }) => {
    return (
      <div className={theme}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (re-render)
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.theme === nextProps.theme
    );
  }
);
```

### Practical Example: List Items

```javascript
function MessageList({ messages }) {
  return (
    <div>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}

const MessageItem = React.memo(({ message }) => {
  console.log(`Rendering message ${message.id}`);
  
  return (
    <div className="message">
      <h4>{message.author}</h4>
      <p>{message.text}</p>
      <small>{message.timestamp}</small>
    </div>
  );
});
```

### Combining React.memo with useCallback

```javascript
function ContactList() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Alice', favorite: false },
    { id: 2, name: 'Bob', favorite: false },
  ]);

  const toggleFavorite = useCallback((id) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id
          ? { ...contact, favorite: !contact.favorite }
          : contact
      )
    );
  }, []);

  return (
    <div>
      {contacts.map(contact => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}

const ContactCard = React.memo(({ contact, onToggleFavorite }) => {
  console.log(`ContactCard ${contact.id} rendered`);
  
  return (
    <div>
      <span>{contact.name}</span>
      <button onClick={() => onToggleFavorite(contact.id)}>
        {contact.favorite ? '★' : '☆'}
      </button>
    </div>
  );
});
```

---

## When to Use Performance Hooks (and When NOT to) {#when-to-use}

### ✅ When to Use useCallback

**Use it when:**
- Passing callbacks to memoized child components
- The callback is a dependency of other hooks (useEffect, useMemo)
- Working with expensive event handlers in large lists

**Example:**

```javascript
function DataGrid({ data }) {
  const handleRowClick = useCallback((rowId) => {
    // Navigate or update state
  }, []);

  return (
    <div>
      {data.map(row => (
        <Row key={row.id} data={row} onClick={handleRowClick} />
      ))}
    </div>
  );
}

const Row = React.memo(({ data, onClick }) => {
  return <tr onClick={() => onClick(data.id)}>...</tr>;
});
```

### ❌ When NOT to Use useCallback

**Don't use it when:**

- The child component isn't memoized
- The callback is used only in the parent component
- Performance isn't an issue
- The component is simple and renders quickly

**Bad Example:**

```javascript
// ❌ Unnecessary - ChildComponent isn't memoized
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <ChildComponent onClick={handleClick} />;
}

function ChildComponent({ onClick }) {
  return <button onClick={onClick}>Click</button>;
}
```

### ✅ When to Use useMemo

**Use it when:**

- Performing expensive calculations (filtering, sorting, transforming large datasets)
- Creating object/array references passed to memoized components
- Computing derived state from props/state

**Example:**

```javascript
function DataAnalytics({ data }) {
  // Expensive calculation
  const statistics = useMemo(() => {
    const sum = data.reduce((a, b) => a + b.value, 0);
    const avg = sum / data.length;
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    
    return { sum, avg, max, min };
  }, [data]);

  return <StatisticsDisplay stats={statistics} />;
}
```

### ❌ When NOT to Use useMemo

**Don't use it when:**

- The calculation is simple (basic arithmetic, string concatenation)
- You're optimizing prematurely
- The component renders infrequently
- The dependencies change frequently (defeats the purpose)

**Bad Examples:**

```javascript
// ❌ Unnecessary - simple calculation
const fullName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName]
);

// ❌ Unnecessary - cheap operation
const uppercaseText = useMemo(
  () => text.toUpperCase(),
  [text]
);

// ❌ Defeats purpose - dependencies change too often
const filtered = useMemo(
  () => data.filter(item => item.value > threshold),
  [data, threshold, userInput, timestamp, randomValue]
);
```

### ✅ When to Use React.memo

**Use it when:**

- Component renders often with the same props
- Component is in a list
- Component's render is expensive (complex UI, many elements)
- Parent re-renders frequently but child's props rarely change

**Example:**

```javascript
// Expensive component in a frequently updating parent
const ComplexChart = React.memo(({ data, config }) => {
  // Expensive D3 chart rendering
  return <canvas>...</canvas>;
});

function Dashboard() {
  const [time, setTime] = useState(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Current time: {time}</p>
      <ComplexChart data={chartData} config={chartConfig} />
    </div>
  );
}
```

### ❌ When NOT to Use React.memo

**Don't use it when:**

- Props change frequently
- Component is simple and renders quickly
- You haven't measured a performance problem
- The comparison cost exceeds the render cost

**Bad Example:**

```javascript
// ❌ Unnecessary - simple component
const Button = React.memo(({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
});
```

### Performance Optimization Decision Tree

```
Is there a measured performance problem?
├─ No → Don't optimize yet
└─ Yes → Is it caused by re-renders?
    ├─ No → Look elsewhere (network, calculations)
    └─ Yes → What's causing unnecessary re-renders?
        ├─ Expensive calculations → useMemo
        ├─ Function props to memoized children → useCallback
        ├─ Component re-renders with same props → React.memo
        └─ Multiple issues → Combine techniques
```

---

## Profiling with React DevTools {#profiling}

### Installing React DevTools

1. Install the browser extension:
   - Chrome: [React Developer Tools](https://chrome.google.com/webstore)
   - Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/)

2. Open DevTools (F12) and look for "⚛️ Components" and "⚛️ Profiler" tabs

### Using the Profiler

#### Step 1: Start Recording

```javascript
// Your component
function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
      <ExpensiveList items={items} />
    </div>
  );
}
```

1. Open the Profiler tab
2. Click the record button (⏺)
3. Interact with your app
4. Click stop (⏹)

#### Step 2: Analyze the Results

**Flame Graph**: Shows component hierarchy and render times

- Taller bars = slower renders
- Width = how much of the total render time

**Ranked Chart**: Lists components by render time

- Helps identify the slowest components

**Component Chart**: Shows individual component renders over time

### Reading the Profiler Data

```javascript
function ProfilerExample() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <App />
    </Profiler>
  );
}

function onRenderCallback(
  id, // the "id" prop of the Profiler tree
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time without memoization
  startTime, // when React began rendering
  commitTime, // when React committed the update
  interactions // Set of interactions for this update
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}
```

### Identifying Performance Issues

**Look for:**

1. **Unnecessary re-renders**: Components that render without prop changes
2. **Long render times**: Components taking >16ms (60fps threshold)
3. **Cascading renders**: One update triggering many child renders

### Example: Finding and Fixing Issues

**Before Optimization:**

```javascript
function UnoptimizedApp() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');

  // Problem: recreated every render
  const expensiveData = {
    processed: heavyCalculation(filter),
    timestamp: Date.now()
  };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <FilterInput value={filter} onChange={setFilter} />
      <DataDisplay data={expensiveData} />
    </div>
  );
}
```

**Profiler shows**: `DataDisplay` re-renders on every count change

**After Optimization:**

```javascript
function OptimizedApp() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');

  const expensiveData = useMemo(() => ({
    processed: heavyCalculation(filter),
    timestamp: Date.now()
  }), [filter]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <FilterInput value={filter} onChange={setFilter} />
      <MemoizedDataDisplay data={expensiveData} />
    </div>
  );
}

const MemoizedDataDisplay = React.memo(DataDisplay);
```

### Chrome DevTools Performance Tab

For deeper analysis:

1. Open DevTools → Performance tab
2. Click Record
3. Interact with app
4. Stop recording

**Look for:**

- Long tasks (yellow/orange blocks)
- Layout thrashing
- Excessive scripting time

---

## Re-render Optimization Strategies {#optimization-strategies}

### Strategy 1: Component Splitting

**Problem:** Large component re-renders everything

```javascript
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
```

**Solution:** Split into smaller components

```javascript
// ✅ Good - only Clock re-renders
function Dashboard() {
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
```

### Strategy 2: Move State Down

```javascript
// ❌ Bad - state at top level affects everything
function App() {
  const [selectedTab, setSelectedTab] = useState('home');
  const [formData, setFormData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Navigation selectedTab={selectedTab} onTabChange={setSelectedTab} />
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <MainContent tab={selectedTab}>
        <Form data={formData} onChange={setFormData} />
      </MainContent>
    </div>
  );
}

// ✅ Good - state lives where it's used
function App() {
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <div>
      <Navigation selectedTab={selectedTab} onTabChange={setSelectedTab} />
      <SidebarContainer />
      <MainContent tab={selectedTab}>
        <FormContainer />
      </MainContent>
    </div>
  );
}

function SidebarContainer() {
  const [isOpen, setIsOpen] = useState(false);
  return <Sidebar isOpen={isOpen} onToggle={setIsOpen} />;
}

function FormContainer() {
  const [formData, setFormData] = useState({});
  return <Form data={formData} onChange={setFormData} />;
}
```

### Strategy 3: Composition with Children

```javascript
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

function Container({ children }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {children}
    </div>
  );
}
```

### Strategy 4: Lazy Loading

```javascript
import React, { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const HeavyTable = lazy(() => import('./HeavyTable'));

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab} />
      <Suspense fallback={<div>Loading...</div>}>
        {activeTab === 'chart' && <HeavyChart />}
        {activeTab === 'table' && <HeavyTable />}
      </Suspense>
    </div>
  );
}
```

### Strategy 5: Virtualization for Long Lists

```javascript
import { FixedSizeList } from 'react-window';

// ❌ Bad - renders 10,000 items
function BadList({ items }) {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

// ✅ Good - only renders visible items
function GoodList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### Strategy 6: Debouncing and Throttling

```javascript
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      const data = await fetchResults(searchQuery);
      setResults(data);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <ResultsList results={results} />
    </div>
  );
}
```

---

## Practical Examples {#practical-examples}

### Example 1: Optimized Todo App

```javascript
import React, { useState, useCallback, useMemo } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    return filtered;
  }, [todos, filter, searchTerm]);

  // Memoized callbacks
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

const TodoInput = React.memo(({ onAdd }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
});

const TodoFilters = React.memo(({ filter, onFilterChange, searchTerm, onSearchChange }) => {
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search todos..."
      />
      <button onClick={() => onFilterChange('all')}>All</button>
      <button onClick={() => onFilterChange('active')}>Active</button>
      <button onClick={() => onFilterChange('completed')}>Completed</button>
    </div>
  );
});

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});
```

### Example 2: Optimized Data Table

```javascript
import React, { useState, useMemo, useCallback } from 'react';

function DataTable({ data }) {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Memoized sorted data
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const handleSort = useCallback((column) => {
    if (column === sortColumn) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  return (
    <div>
      <table>
        <TableHeader onSort={handleSort} sortColumn={sortColumn} />
        <tbody>
          {paginatedData.map(row => (
            <TableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={Math.ceil(sortedData.length / pageSize)}
        onPageChange={setPage}
      />
    </div>
  );
}

const TableHeader = React.memo(({ onSort, sortColumn }) => {
  return (
    <thead>
      <tr>
        <th onClick={() => onSort('name')}>
          Name {sortColumn === 'name' && '↕'}
        </th>
        <th onClick={() => onSort('age')}>
          Age {sortColumn === 'age' && '↕'}
        </th>
        <th onClick={() => onSort('email')}>
          Email {sortColumn === 'email' && '↕'}
        </th>
      </tr>
    </thead>
  );
});

const TableRow = React.memo(({ row }) => {
  return (
    <tr>
      <td>{row.name}</td>
      <td>{row.age}</td>
      <td>{row.email}</td>
    </tr>
  );
});

const Pagination = React.memo(({ page, totalPages, onPageChange }) => {
  return (
    <div>
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span>Page {page + 1} of {totalPages}</span>
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
});
```

### Example 3: Real-Time Dashboard

```javascript
import React, { useState, useEffect, useMemo, useCallback } from 'react';

function RealtimeDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [timeRange, setTimeRange] = useState('1h');

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data
      setMetrics(prev => [...prev, {
        timestamp: Date.now(),
        value: Math.random() * 100
      }].slice(-100)); // Keep last 100 points
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Memoized statistics
  const statistics = useMemo(() => {
    if (metrics.length === 0) return null;

    const values = metrics.map(m => m.value);
    return {
      current: values[values.length - 1],
      average: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values)
    };
  }, [metrics]);

  // Memoized filtered data
  const filteredMetrics = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    };

    const cutoff = now - ranges[timeRange];
    return metrics.filter(m => m.timestamp >= cutoff);
  }, [metrics, timeRange]);

  return (
    <div>
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      <StatisticsPanel stats={statistics} />
      <MetricsChart data={filteredMetrics} />
    </div>
  );
}

const TimeRangeSelector = React.memo(({ value, onChange }) => {
  return (
    <div>
      <button onClick={() => onChange('1h')}>1 Hour</button>
      <button onClick={() => onChange('6h')}>6 Hours</button>
      <button onClick={() => onChange('24h')}>24 Hours</button>
    </div>
  );
});

const StatisticsPanel = React.memo(({ stats }) => {
  if (!stats) return null;

  return (
    <div>
      <div>Current: {stats.current.toFixed(2)}</div>
      <div>Average: {stats.average.toFixed(2)}</div>
      <div>Max: {stats.max.toFixed(2)}</div>
      <div>Min: {stats.min.toFixed(2)}</div>
    </div>
  );
});

const MetricsChart = React.memo(({ data }) => {
  // Render chart using data
  return <div>Chart with {data.length} points</div>;
});
```

---

## Common Pitfalls {#common-pitfalls}

### Pitfall 1: Forgetting Dependencies

```javascript
// ❌ Bad - stale closure
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + 1); // Uses stale 'count'
  }, []); // Empty dependencies!

  return <button onClick={increment}>Count: {count}</button>;
}

// ✅ Good - use functional update
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return <button onClick={increment}>Count: {count}</button>;
}
```

### Pitfall 2: Over-Optimization

```javascript
// ❌ Bad - unnecessary optimization
function SimpleComponent({ name }) {
  const greeting = useMemo(() => `Hello, ${name}!`, [name]);
  
  return <div>{greeting}</div>;
}

// ✅ Good - keep it simple
function SimpleComponent({ name }) {
  return <div>Hello, {name}!</div>;
}
```

### Pitfall 3: Memoizing Everything

```javascript
// ❌ Bad - too much memoization
const App = React.memo(() => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const message = useMemo(() => `Count: ${count}`, [count]);
  const isEven = useMemo(() => count % 2 === 0, [count]);

  return (
    <MemoizedButton onClick={handleClick}>
      {message} - {isEven ? 'Even' : 'Odd'}
    </MemoizedButton>
  );
});

const MemoizedButton = React.memo(({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
});

// ✅ Good - only memoize what matters
function App() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count} - {count % 2 === 0 ? 'Even' : 'Odd'}
    </button>
  );
}
```

### Pitfall 4: Inline Object/Array in Dependencies

```javascript
// ❌ Bad - creates new object every render
function UserProfile({ userId }) {
  const options = { cache: true, retry: 3 };
  
  useEffect(() => {
    fetchUser(userId, options);
  }, [userId, options]); // 'options' is always new!
}

// ✅ Good - memoize or move outside
const OPTIONS = { cache: true, retry: 3 };

function UserProfile({ userId }) {
  useEffect(() => {
    fetchUser(userId, OPTIONS);
  }, [userId]);
}
```

### Pitfall 5: React.memo with Non-Primitive Props

```javascript
// ❌ Bad - object prop changes every render
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <MemoizedChild user={{ name: 'John', id: 1 }} />
  );
}

const MemoizedChild = React.memo(({ user }) => {
  return <div>{user.name}</div>;
});

// ✅ Good - memoize object
function Parent() {
  const [count, setCount] = useState(0);
  
  const user = useMemo(() => ({ name: 'John', id: 1 }), []);

  return <MemoizedChild user={user} />;
}
```

---

## Best Practices {#best-practices}

### 1. Measure Before Optimizing

```javascript
// Use Profiler to identify actual bottlenecks
import { Profiler } from 'react';

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponents />
    </Profiler>
  );
}

function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 16) {
    console.warn(`Slow render in ${id}: ${actualDuration}ms`);
  }
}
```

### 2. Start with Component Architecture

```javascript
// Good architecture reduces need for optimization
function GoodArchitecture() {
  return (
    <>
      <IndependentHeader />
      <IndependentSidebar />
      <IndependentContent />
    </>
  );
}
```

### 3. Use ESLint Rules

```javascript
// Install eslint-plugin-react-hooks
// .eslintrc.js
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 4. Document Performance Decisions

```javascript
// Good - explain why you're optimizing
const ExpensiveCalculation = useMemo(() => {
  // This calculation processes 10,000+ items and takes ~50ms
  // Memoizing prevents it from running on every filter change
  return data.map(processItem).reduce(aggregate, initialValue);
}, [data]);
```

### 5. Use React DevTools Profiler Regularly

- Profile during development
- Test with realistic data volumes
- Check both development and production builds

### 6. Combine Techniques Wisely

```javascript
function OptimizedList({ items, onItemClick }) {
  // 1. Memoize expensive calculations
  const sortedItems = useMemo(() => 
    [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  // 2. Memoize callbacks
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {sortedItems.map(item => (
        // 3. Memoize list items
        <MemoizedListItem
          key={item.id}
          item={item}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

const MemoizedListItem = React.memo(ListItem);
```

### 7. Know When to Break the Rules

```javascript
// Sometimes it's okay to NOT optimize
function SimpleCounter() {
  const [count, setCount] = useState(0);
  
  // This is fine - simple component, no performance issue
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## Summary

### Key Takeaways

1. **useCallback**: Memoize functions to prevent child re-renders
2. **useMemo**: Memoize expensive calculations
3. **React.memo**: Memoize components with stable props
4. **Measure first**: Use React DevTools Profiler before optimizing
5. **Architecture matters**: Good component design reduces optimization needs

### Optimization Checklist

- [ ] Identified a real performance problem with profiling
- [ ] Checked component architecture for unnecessary re-renders
- [ ] Applied memoization only where it helps
- [ ] Verified optimization improved performance
- [ ] Added comments explaining optimization decisions
- [ ] Tested with production build

### Remember

> Premature optimization is the root of all evil. - Donald Knuth

Focus on writing clean, readable code first. Optimize only when you have measured performance problems. React is fast by default for most use cases.

---

## Additional Resources

- [React Official Docs - Performance](https://react.dev/learn/render-and-commit)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Web.dev - React Performance](https://web.dev/react/)
- [Kent C. Dodds - When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

---

**Happy Optimizing! 🚀**
